import Container from '@mui/material/Container';
import WordCounter from '../../../../components/text-tools/WordCounter';

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <WordCounter />
    </Container>
  );
}