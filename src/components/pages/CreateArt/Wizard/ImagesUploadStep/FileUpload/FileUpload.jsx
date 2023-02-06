import React, {useRef, useState,useEffect} from "react";

import {DEFAULT_MAX_FILE_SIZE_IN_BYTES} from "../../../../../../constants/files";
import heic2any from "heic2any";
import "./file-upload.scss";
import Loader from "../../../../../common/Loader/loader";
import {useDispatch, useSelector} from "react-redux";
import {updateLoading} from "../../../../../../store/slices/filesSlice";

const FileUpload = ({
                      label,
                      updateFilesCb,
                      maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
                      backgroundLetter,
                      id,
                      fIndex,
                      ...otherProps
                    }) => {
                      const dispatch = useDispatch();
                      const filesData = useSelector((filesSlice) => filesSlice.files.list[fIndex]);
                      let loader = filesData.loading;
                      useEffect(() => {
                          loader = filesData.loading;
                      }, [filesData, loader])
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});
  const [newImage, setNewImage] = useState();
  const backgroundClassValues = ["bgA", "bgB", "bgC"];
  const buttonLetterValues = ["A", "B", "C"];

  const backgroundClass = backgroundClassValues[backgroundLetter];
  const buttonLetter = buttonLetterValues[backgroundLetter];

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (file.size <= maxFileSizeInBytes) {
        if (!otherProps.multiple) {
          return {file};
        }
        files[file.name] = file;
      }
    }
    return {...files};
  };

  const callUpdateFilesCb = (files) => {
    const filesAsArray = Object.values(files);
    if (filesAsArray?.length) {
      const newFiles = otherProps.multiple ? filesAsArray : filesAsArray[0];
      if (newFiles || files) {
        updateFilesCb(newFiles);
      }
    } else {
      updateFilesCb(files);
    }
  };

  const handleNewFileUpload = (e) => {
    const files = e.target.files;
    const file = files[0];
    dispatch(updateLoading({index: fIndex, loading: true}))
    if (file.name.slice(-4) === "heic" || file.name.slice(-4) === "heif") {
      if (
        file.type.toLowerCase() === "image/heic" ||
        (file.name.toLowerCase().includes(".heic") || file.name.toLowerCase().includes(".heif"))
      ) {
        toggleWaiting();

        heic2any({blob: file, toType: "image/jpg", quality: 1}).then(
          (newImage) => {
            callUpdateFilesCb(newImage)
            setFiles(newImage);
            const url = URL.createObjectURL(newImage);
            toggleWaiting();
            addNewImage(url);
          }
        );
      }
    } else {
      const updatedFiles = addNewFiles(files);
      setFiles(updatedFiles.file);
      callUpdateFilesCb(updatedFiles);
    }
  };

  function addNewImage(img) {
    setNewImage(img);
  }

  function toggleWaiting() {
    const waitBox = document.querySelector("#waiting");
    if (waitBox) {
      document.body.removeChild(waitBox);
    } else {
      const _waitBox = document.createElement("div");
      _waitBox.id = "waiting";
      _waitBox.innerHTML = "Image is processing...";
      document.body.appendChild(_waitBox);
    }
  }

  return (
    <div className="file-upload ">
      <button className={`file-upload__button ${backgroundClass}`}>
      {
        loader && <Loader/>
    }
        <input
          id={id}
          className="file-upload__input"
          type="file"
          ref={fileInputField}
          onChange={handleNewFileUpload}
          title=""
          value=""
          {...otherProps}

        />

        <div className="file-upload__info">
          <div className="choose__button">{`UPLOAD IMAGE ${buttonLetter}`}</div>
        </div>
      </button>
    </div>
  );
};

export default FileUpload;
