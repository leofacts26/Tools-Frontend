import FinanceCards from "@/components/cards/FinanceCards";
import { Container, Stack } from "@mui/material";

export default function Page() {
  return (
    <>
      <section className="blog-bg">
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%", width: "100%", textAlign: "center", mt: 4 }}
          >
            <h1 className="mb-3">Finance Blogs</h1>
            <svg
              width="115"
              height="18"
              viewBox="0 0 115 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 4c11.5 0 11.5 10 23 10S34.5 4 46 4s11.5 10 23 10S80.5 4 92 4s11.5 10 23 10"
                stroke="#ec407a"
                strokeWidth="8"
                fill="none"
                fillRule="evenodd"
              ></path>
            </svg>

            <p style={{ marginTop: "30px" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
              pariatur dolores reprehenderit odio culpa officiis iure tenetur
              explicabo exercitationem cum! Impedit repellendus aperiam mollitia
              laudantium et tenetur iure nostrum cupiditate.
            </p>
          </Stack>
        </Container>
      </section>

      {/* Cards + pagination */}
      <FinanceCards />
    </>
  );
}
