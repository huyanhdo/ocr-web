import axios from "axios";
import React, { useState } from "react";
import MySVG1 from "./assets/img_1.png";
import MySVG2 from "./assets/img_2.png";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import ArrowCircleRightRoundedIcon from "@mui/icons-material/ArrowCircleRightRounded";
import CircularProgress from "@mui/material/CircularProgress";
function App() {
  const [img, setImg] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRes, setIsRes] = useState(false);
  const [isError, setIsError] = useState(false);

  const predict = (img) => {
    let formData = new FormData();
    formData.append("image", img);
    const customHeader = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const post_url = "http://127.0.0.1:5000/predict";
    const get_url = "http://127.0.0.1:5000/res";
    setIsLoading(true);
    axios
      .post(post_url, formData, customHeader)
      .then(() => axios.get(get_url))
      .then(() => {
        setImg(get_url);
      })
      .then(() => {
        setIsRes(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  };
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleOnload = () => {
    setIsHovering(false);
  };

  const onBack = () => {
    setIsChecking(false);
    setImg(null);
  };

  const onSubmit = () => {
    setIsChecking(false);
    predict(img);
  };

  return (
    <div
      className="App"
      style={{
        height: "100vh",
        padding: "None",
        margin: "None",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        py={6}
        sx={{
          width: "100%",
          height: "50px",
          position: "absolute",
          top: "0",
          backgroundColor: "rgba(255, 153, 0, 0.5)",
          display: "flex",
          justifyContent: "space-between",
          padding: "0 0 0 0 ",
        }}
      >
        {img && (
          <IconButton onClick={onBack} disabled={isLoading}>
            <ArrowCircleLeftRoundedIcon sx={{ fontSize: "50px" }} />
          </IconButton>
        )}

        {isChecking && (
          <IconButton onClick={onSubmit} disabled={isLoading}>
            <ArrowCircleRightRoundedIcon sx={{ fontSize: "50px" }} />
          </IconButton>
        )}
      </Box>
      {isLoading ? (
        <CircularProgress size="5rem" sx={{ color: "rgba(255, 153, 0)" }} />
      ) : img ? (
        !isError ? (
          <img
            onLoad={handleOnload}
            src={!isRes ? URL.createObjectURL(img) : img}
            style={{ border: "solid", maxHeight: "500px", width: "80%" }}
          />
        ) : (
          <h1>Error;</h1>
        )
      ) : (
        <>
          <Box
            sx={{
              marginTop: "-100px",
              height: "40%",
              width: "50%",
              maxWidth: "80%",
              maxHeight: "80vh",
              backgroundColor: "rgba(255, 153, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",

              borderRadius: "50px",
            }}
          >
            <h1 style={{ fontSize: "100px", margin: "30px 0px 30px 0px" }}>
              Project 3
            </h1>
            <Box
              sx={{ backgroundColor: "black", width: "60%", height: "10px" }}
            ></Box>
            <Box py={1}></Box>
            <div
              style={{
                width: "60%",
                height: "30%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isHovering ? "#D3D3D3" : "#FFFFFF",
                border: "None",
                borderRadius: "30px",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {" "}
              <label
                for="upload"
                style={{
                  width: "100%",
                  height: "100%",
                  fontSize: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: isHovering ? "pointer" : "none",
                  fontFamily: "Lexend Deca",
                }}
              >
                <b>Upload your image here </b>
                <input
                  id="upload"
                  accept="image/*"
                  type="file"
                  hidden
                  onClick={() => {
                    setIsRes(false);
                    setIsError(false);
                  }}
                  onChange={(e) => {
                    setImg(e.target.files[0]);
                    setIsChecking(true);
                  }}
                />
              </label>
            </div>
          </Box>
        </>
      )}
      <img
        src={MySVG1}
        style={{
          position: "absolute",
          width: "100%",
          height: "150px",
          left: "0px",
          bottom: 0,
          zIndex: -1,
        }}
        alt="None"
      />
      <img
        src={MySVG2}
        style={{
          position: "absolute",
          width: "100%",
          height: "150px",
          left: "0px",
          bottom: 0,
          zIndex: -1,
        }}
        alt="None"
      />
    </div>
  );
}
export default App;
