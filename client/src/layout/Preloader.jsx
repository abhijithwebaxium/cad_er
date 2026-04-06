import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import ExportLoader from "../components/ExportLoader";

const Preloader = () => {
  const { global } = useSelector((state) => state.loading);

  const [isVisible, setIsVisible] = useState(true);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (global === false) {
      setProgress(100);
      timer = setTimeout(() => setIsVisible(false), 800);
    } else {
      setIsVisible(true);
      setProgress(30);
    }
    return () => clearTimeout(timer);
  }, [global]);

  return <ExportLoader open={isVisible} loader={"main"} />;
};

export default Preloader;
