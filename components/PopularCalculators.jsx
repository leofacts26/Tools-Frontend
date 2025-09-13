import { Paper } from "@mui/material"

const PopularCalculators = () => {
  return (
    <>
      <Paper elevation={0} sx={{ border: "none", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <h2 className="finance-sub-heading">Popular Calculator</h2>
        <p>Lumpsum Calculator</p>
        <p>SWP Calculator</p>
      </Paper>
    </>
  )
}
export default PopularCalculators