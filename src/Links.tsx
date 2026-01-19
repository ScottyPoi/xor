import Link from "@mui/material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import BugReportIcon from "@mui/icons-material/BugReport";
import { Box } from "@mui/system";

const linksStyle = {
  position: "fixed",
  right: "20px",
  bottom: "20px",
  maxWidth: "200px",
  maxHeight: "100px",
  backgroundColor: "white",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
  padding: "10px",
  borderRadius: "10px",
  opacity: "0.5",
};

const Links = () => {
  return (
    <Box
      sx={linksStyle}
    >
      <Link
        href="https://github.com/scottypoi/xor"
        target="_blank"
        rel="noopener"
      >
        <GitHubIcon /> Project Repository
      </Link>
      <br />
      <Link
        href="https://github.com/scottypoi/xor/issues"
        target="_blank"
        rel="noopener"
      >
        <BugReportIcon /> Report Issues
      </Link>
    </Box>
  );
};

export default Links;
