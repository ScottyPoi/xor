import { useContext } from "react";
import {
  PlayArrow,
  Pause,
  HideImage,
  Slideshow,
} from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { BinaryTreeContext } from "./BinaryTreeProvider";
import { CarouselProps } from "./types";

export default function CarouselControls({
  isPlaying,
  isShown,
  toggleShown,
  togglePlaying,
}: CarouselProps) {
  useContext(BinaryTreeContext);
  return (
    <Box width="100%" height={"50px"} >
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
    </Box>
  );
}

function PlayButton({ togglePlaying }: { togglePlaying: () => void }) {
  return <Button style={{ color: 'yellow'}} startIcon={<PlayArrow />} onClick={togglePlaying} />;
}
function PauseButton({ togglePlaying }: { togglePlaying: () => void }) {
  return <Button style={{ color: 'yellow'}} endIcon={<Pause />} onClick={togglePlaying} >Pause</Button>;
}
function ShowButton({ toggleShown }: { toggleShown: () => void }) {
  return (
    <Button style={{ color: 'yellow'}} startIcon={<Slideshow />} onClick={toggleShown}>
      Show Tutorial
    </Button>
  );
}
function HideButton({ toggleShown }: { toggleShown: () => void }) {
  return (
    <Button style={{ color: 'yellow'}} startIcon={<HideImage />} onClick={toggleShown}>
      Hide
    </Button>
  );
}
