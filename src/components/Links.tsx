import GitHubIcon from "@mui/icons-material/GitHub";
import BugReportIcon from "@mui/icons-material/BugReport";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Links = () => {
  return (
    <Paper
      elevation={6}
      sx={{
        position: "fixed",
        right: 20,
        bottom: 20,
        maxWidth: 240,
        p: 1.5,
        borderRadius: 2,
        opacity: 0.75,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={1}>
        <Link
          href="https://github.com/scottypoi/xor"
          target="_blank"
          rel="noopener"
          underline="hover"
          color="text.primary"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <GitHubIcon fontSize="small" />
          <Typography variant="body2">Project Repository</Typography>
        </Link>
        <Link
          href="https://github.com/scottypoi/xor/issues"
          target="_blank"
          rel="noopener"
          underline="hover"
          color="text.primary"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <BugReportIcon fontSize="small" />
          <Typography variant="body2">Report Issues</Typography>
        </Link>
      </Stack>
    </Paper>
  );
};

export default Links;
