import { useContext } from "react";
import {
  PlayArrow,
  Pause,
  HideImage,
  Slideshow,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { BinaryTreeContext } from "../context/BinaryTreeProvider";
import { CarouselProps } from "../types";

export default function CarouselControls({
  isPlaying,
  isShown,
  toggleShown,
  togglePlaying,
}: CarouselProps) {
  useContext(BinaryTreeContext);
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ width: "100%", height: 50 }}
    >
      {isPlaying ? (
        <PauseButton togglePlaying={togglePlaying} />
      ) : (
        <PlayButton togglePlaying={togglePlaying} />
      )}
      {isShown ? (
        <HideButton toggleShown={toggleShown} />
      ) : (
        <ShowButton toggleShown={toggleShown} />
      )}
    </Stack>
  );
}

function PlayButton({ togglePlaying }: { togglePlaying: () => void }) {
  return (
    <Tooltip title="Play">
      <IconButton
        aria-label="Play"
        onClick={togglePlaying}
        sx={{ color: "warning.main" }}
      >
        <PlayArrow />
      </IconButton>
    </Tooltip>
  );
}
function PauseButton({ togglePlaying }: { togglePlaying: () => void }) {
  return (
    <Tooltip title="Pause">
      <IconButton
        aria-label="Pause"
        onClick={togglePlaying}
        sx={{ color: "warning.main" }}
      >
        <Pause />
      </IconButton>
    </Tooltip>
  );
}
function ShowButton({ toggleShown }: { toggleShown: () => void }) {
  return (
    <Button
      sx={{ color: "warning.main" }}
      startIcon={<Slideshow />}
      onClick={toggleShown}
    >
      Show Tutorial
    </Button>
  );
}
function HideButton({ toggleShown }: { toggleShown: () => void }) {
  return (
    <Button
      sx={{ color: "warning.main" }}
      startIcon={<HideImage />}
      onClick={toggleShown}
    >
      Hide
    </Button>
  );
}
