import React, { useRef, useState } from 'react'
import './styles.css'
import { BiSolidFileImage } from 'react-icons/bi';
import ReactJson from 'react-json-view';
import axios from 'axios';


const Home = _ => {

    const defaultJson = {
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false)
    const [JSONData, setJSONData] = useState(defaultJson)

    const jsonData = {
        "image": "speed limit (30km/h)"
    }
    const hiddenFileInput = useRef(null);

    // Handle file selection
    const handleFileSelect = _ => {
        hiddenFileInput?.current?.click();
    };

    // handle image selection
    const handlechange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setJSONData(defaultJson)
    }

    // Handle file drop
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
        setJSONData(defaultJson)
    };

    // Prevent the default behavior of the browser when a file is dropped
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    // Handle file drag leave
    const handleDragLeave = () => {
        setIsDragging(false);
        setJSONData(defaultJson)
    };

    // handle cleare adata
    const handleClearData = _ => {
        setSelectedFile(null)
        setJSONData(defaultJson)
    }

    // handle cleare adata
    const hamdleUpload = async _ => {
        setJSONData(defaultJson)
        setLoading(true)

        // setTimeout(() => {
        //     setLoading(false)
        //     setJSONData(jsonData)
        // }, 5000);

        const result = await uploadImage()
        setLoading(false)
        if (result[0]) {
            setJSONData(result[1])

        } else {
            setJSONData(defaultJson)
        }
    }

    const uploadImage = async () => {
        const formData = new FormData();

        formData.append('file', selectedFile); //update the _name_

        try {
            const response = await axios({
                method: "post",
                url: "http://127.0.0.1:8000/uploadfile/", //update the url
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            const result = response?.data
            return [true, result]
        } catch (error) {
            console.log(error, 'error')
            return [false]
        }
    }

    return (
        <div className='root'>
            <h1 className='page_title'>trafic signal traker</h1>
            {/* image upload container */}
            <div className='container'>
                <h1 className='title_text'>
                    Upload your file
                </h1>
                {/* drop and file selection area */}

                <div onClick={handleFileSelect} className={`drop_area ${isDragging ? 'drop_over' : ''}`} onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    {

                        selectedFile ? <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Selected File"
                            className='preview_image'
                        /> : <>
                            <BiSolidFileImage className='icon' />
                            <p className='text_1'>Drop your file here or Click to browse</p>

                        </>
                    }
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlechange}
                        style={{ display: 'none' }}
                        id="fileInput"
                        ref={hiddenFileInput}
                    />
                </div>
                {/* action buttons */}
                {selectedFile && <div className='button_wrapper'>
                    <button onClick={handleClearData} className='close_button'>Close</button>
                    <button onClick={hamdleUpload} className='upload_button'>Upload</button>
                </div>}
                {/* loading scetion */}
                {
                    loading && <div className='loading_wrapper'>
                        <div className="spinner"></div>
                    </div>
                }


            </div>
            <scroll className='response_container' >

                <ReactJson
                    src={JSONData}
                    theme='google'
                    displayDataTypes={false} // Hide data types
                    displayObjectSize={false} // Hide object size
                    enableClipboard={false}
                />
            </scroll>
        </div>

    )
}

export default Home