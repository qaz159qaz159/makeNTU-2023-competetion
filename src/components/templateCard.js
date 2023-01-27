import React, { forwardRef, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Paper,
  Typography,
  ButtonBase,
  Grid,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import { NumericFormat } from "react-number-format";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import ImgDialog from "./ImgDialog";

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      //   thousandSeparator
      //   isNumericString
      //   prefix="$"
    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
const Img = styled(Box)({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
  fontSize: "1rem",
});
ComplexGrid.propTypes = {
  setAddCardData: PropTypes.func.isRequired,
};
export default function ComplexGrid({ setAddCardData }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [values, setValues] = useState({
    name: "",
    category: "",
    limit: 1,
    totalNum: 5,
    image: "",
  });
  const uploadImg = (link) => {
    // console.log(link, "link");
    setValues(() => ({ ...values, image: link }));
    setOpenDialog(false);
  };
  const [hasFocus, setHasFocus] = useState({ name: false, category: false });
  // const nameInputRef = useRef(null);
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]:
        event.target.name === "name" || event.target.name === "category"
          ? event.target.value
          : parseInt(event.target.value),
    });
  };
  const handleKeyDown = (event) => {
    if (event.key !== "Enter") {
      // // // console.log(event.key);
      return;
    }
    setHasFocus(() => {
      return { name: true, category: true };
    });
    let { name, limit, totalNum, category } = values;
    if (name && limit && totalNum && category) {
      setAddCardData(values);
      if (event.target.name === "name") event.target.value = "";
      setValues({
        ...values,
        name: "",
      });
    } else {
      // // console.log("something missing: ", name, limit, totalNum);
    }
  };
  // // // console.log(values);
  return (
    <Paper
      sx={{
        p: 2,
        margin: "5px",
        width: "20%",
        height: "auto",
        maxHeight: "330px",
        maxWidth: 230,
        minWidth: 150,
        flexGrow: 1,
        position: "relative",

        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#424200" : "#fff",
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          item
          sx={{
            width: "100%",
          }}
        >
          <TextField
            id="input-name"
            label="Name"
            name="name"
            value={values.name}
            // defaultValue={"Enter Board Name"}
            error={hasFocus.name && !values.name}
            helperText={hasFocus.name && !values.name ? "Required!" : ""}
            autoComplete="off"
            onChange={handleChange}
            onFocus={(event) => {
              if (!event.target.value) {
                setValues({
                  ...values,
                  name: "",
                });
              }
              setHasFocus(() => {
                return { ...hasFocus, name: true };
              });
              event.target.select();
            }}
            onKeyDown={handleKeyDown}
            component="div"
            size="small"
            sx={{
              width: "100%",
              padding: "2px",
              backgroundColor: "rgba(255,255,255,0.3)",
              // marginTop: "5px",
              borderRadius: "10px",
              borderWidth: "1rem",
              borderColor: "#1d1d1d",
              display: "flex",
              justifyContent: "center",
            }}
            // ref={nameInputRef}
          />
        </Grid>
        <Grid
          item
          sx={{
            width: "100%",
          }}
        >
          <TextField
            id="input-category"
            label="category"
            name="category"
            error={hasFocus.category && !values.category}
            helperText={
              hasFocus.category && !values.category ? "Required!" : ""
            }
            autoComplete="off"
            onChange={handleChange}
            onFocus={(event) => {
              if (!event.target.value) {
                setValues({
                  ...values,
                  category: "",
                });
              }
              setHasFocus(() => {
                return { ...hasFocus, category: true };
              });
              event.target.select();
            }}
            onKeyDown={handleKeyDown}
            component="div"
            size="small"
            sx={{
              width: "100%",
              padding: "2px",
              backgroundColor: "rgba(255,255,255,0.3)",
              marginTop: "5px",
              borderRadius: "10px",
              borderWidth: "1rem",
              borderColor: "#1d1d1d",
              display: "flex",
              justifyContent: "center",
            }}
            // ref={nameInputRef}
          />
        </Grid>
        <Grid item>
          <IconButton
            sx={{ width: 100, height: 100 }}
            onClick={() => {
              setOpenDialog(true);
            }} //setOpenDialog(true)}
          >
            {values?.image ? (
              <Img alt="img not found" src={values?.image} component="img" />
            ) : (
              <AddPhotoAlternateOutlinedIcon />
            )}
          </IconButton>
          {/* <ButtonBase sx={{ width: 100, height: 100 }}>
          </ButtonBase>*/}
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography gutterBottom variant="subtitle1" component="div">
            {"上限  :"}
          </Typography>
          <TextField
            id="formatted-numberformat-input_limit"
            label="limit"
            value={values.limit}
            onChange={handleChange}
            name="limit"
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
            onKeyDown={handleKeyDown}
            variant="standard"
            sx={{ width: "50%" }}
            autoComplete="off"
            error={!values.limit}
            helperText={!values.limit ? "Required!" : ""}
          />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography
            gutterBottom
            variant="subtitle1"
            component="div"
            visibility={
              !(hasFocus.name && !values.name) &&
              !(hasFocus.category && !values.category)
                ? "visible"
                : "hidden"
            }
          >
            {"庫存  :"}
          </Typography>
          <TextField
            id="formatted-numberformat-input_totalNum"
            label="stock"
            value={values.totalNum}
            onChange={handleChange}
            name="totalNum"
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
            onKeyDown={handleKeyDown}
            variant="standard"
            sx={{
              width: "50%",
              display:
                !(hasFocus.name && !values.name) &&
                !(hasFocus.category && !values.category)
                  ? "block"
                  : "none",
            }}
            autoComplete="off"
            error={!values.totalNum}
            helperText={!values.totalNum ? "Required!" : ""}
            // visibility={!!values.name && !!values.category ? "visible" : "hidden"}
          />
        </Grid>
      </Grid>
      <ButtonBase
        sx={{
          width: "30px",
          height: "30px",
          borderRadius: "20px",
          position: "absolute",
          right: 0,
          top: 0,
        }}
        onClick={() => {
          setHasFocus(() => {
            return { name: true, category: true };
          });
          let { name, limit, totalNum, category } = values;
          if (name && limit && totalNum && category) {
            setAddCardData(values);
            // nameInputRef.current.value = "";
          } else {
            // // console.log("something missing: ", name, limit, totalNum);
          }
        }}
      >
        <AddCircleIcon />
      </ButtonBase>
      <ImgDialog
        open={openDialog}
        setOpenDialog={setOpenDialog}
        uploadImg={uploadImg}
      />
    </Paper>
  );
}
