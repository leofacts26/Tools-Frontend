"use client";
import React from "react";
import { analyzeText } from "../../lib/wordCounter";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ArticleIcon from '@mui/icons-material/Article';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HeadphonesIcon from '@mui/icons-material/Headphones';

import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';

export default function WordCounter() {
  const [text, setText] = React.useState("");
  const [stats, setStats] = React.useState(() => analyzeText(text));
  const [detectToggle, setDetectToggle] = React.useState(false);

  // undo/redo stack
  const undoRef = React.useRef([]);
  const redoRef = React.useRef([]);

  // update stats debounced
  React.useEffect(() => {
    const id = setTimeout(() => setStats(analyzeText(text)), 250);
    return () => clearTimeout(id);
  }, [text]);

  const handleTextChange = (v) => {
    undoRef.current.push(text);
    redoRef.current = [];
    setText(v);
  };

  const handleUndo = () => {
    if (!undoRef.current.length) return;
    const prev = undoRef.current.pop();
    redoRef.current.push(text);
    setText(prev);
  };

  const handleRedo = () => {
    if (!redoRef.current.length) return;
    const next = redoRef.current.pop();
    undoRef.current.push(text);
    setText(next);
  };

  const handleClear = () => {
    undoRef.current.push(text);
    redoRef.current = [];
    setText('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('copy failed', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePaste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      undoRef.current.push(text);
      redoRef.current = [];
      setText(text + (text && !text.endsWith('\n') ? '\n' : '') + t);
    } catch (err) {
      console.error('paste failed', err);
    }
  };

  const topData = stats.topKeywords.map(k => ({ name: k.word, value: k.count }));

  return (
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2 }} elevation={3}>
            <Stack direction={{ sm: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="h6">{stats.words} words &nbsp; {stats.characters} characters</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Undo"><span><IconButton onClick={handleUndo}><UndoIcon /></IconButton></span></Tooltip>
                <Tooltip title="Redo"><span><IconButton onClick={handleRedo}><RedoIcon /></IconButton></span></Tooltip>
                <Tooltip title="Paste"><IconButton onClick={handlePaste}><ArticleIcon /></IconButton></Tooltip>
                <Tooltip title="Copy"><IconButton onClick={handleCopy}><ContentCopyIcon /></IconButton></Tooltip>
                <Tooltip title="Download"><IconButton onClick={handleDownload}><FileDownloadIcon /></IconButton></Tooltip>
                <Tooltip title="Clear"><IconButton onClick={handleClear}><ClearAllIcon /></IconButton></Tooltip>
              </Stack>
            </Stack>

            <TextField
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type or paste your text here..."
              multiline
              minRows={12}
              maxRows={30}
              fullWidth
            />

            <Divider sx={{ my: 2 }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextFieldsIcon color="action" />
                <Typography variant="body2">{stats.words} words</Typography>
                <ArticleIcon color="action" />
                <Typography variant="body2">{stats.characters} characters</Typography>
                <InsertChartIcon color="action" />
                {/* <Typography variant="body2">{stats.sentences} sentences</Typography> */}
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <AccessTimeIcon color="action" />
                <Typography variant="body2">Reading time: {Math.ceil(stats.readingTimeMin)} min</Typography>
                <HeadphonesIcon color="action" />
                <Typography variant="body2">Speaking time: {Math.ceil(stats.speakingTimeMin)} min</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }} elevation={3}>
            <Typography variant="subtitle1" gutterBottom>Details</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><TextFieldsIcon /></ListItemIcon>
                <ListItemText primary={`${stats.words} words`} secondary={`${stats.sentences} sentences • ${stats.paragraphs} paragraphs`} />
              </ListItem>

              <ListItem>
                <ListItemIcon><AccessTimeIcon /></ListItemIcon>
                <ListItemText primary={`Reading time ${Math.ceil(stats.readingTimeMin)} min`} secondary={`Speaking time ${Math.ceil(stats.speakingTimeMin)} min`} />
              </ListItem>

              <ListItem>
                <ListItemIcon><InsertChartIcon /></ListItemIcon>
                <ListItemText primary={`Flow Score`} secondary={`${stats.flowScore}%`} />
              </ListItem>

              <ListItem>
                <ListItemIcon><ArticleIcon /></ListItemIcon>
                <ListItemText primary={`Reading grade`} secondary={stats.readingLevelGrade ? `${stats.readingLevelGrade} grade` : '—'} />
              </ListItem>
            </List>

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">Top Keywords</Typography>
              <Chip label={`${stats.topKeywords.length}`} size="small" />
            </Stack>

            <Box sx={{ height: 180, mt: 1 }}>
              {topData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} />
                    <ReTooltip />
                    <Bar dataKey="value" fill="#2CA6A4" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">No keywords yet</Typography>
              )}
            </Box>

            <Stack spacing={1} sx={{ mt: 1 }}>
              {stats.topKeywords.slice(0, 10).map(k => (
                <Box key={k.word} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">{k.word}</Typography>
                  <Chip label={`${k.count} • ${k.density.toFixed(1)}%`} size="small" />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
  );
}
