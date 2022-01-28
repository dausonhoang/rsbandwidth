import { useEffect, useState } from "react";
import "./App.css";
import { app } from "./firebase-config";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const storage = getStorage();
function App() {
  const [loading, setLoading] = useState(false);
  const [n, setN] = useState("");
  const [k, setK] = useState("");
  const [evalPoint, setEvalPoint] = useState("ISAL");

  const [fileUrl, setFileUrl] = useState("");
  const [fileError, setFileError] = useState("");

  const getFileUrl = () => {
    setLoading(true);
    getDownloadURL(ref(storage, `${evalPoint}_output_n${n}k${k}.txt`))
      .then((url) => {
        console.log(url);
        setFileUrl(url);
        setFileError("");
        setLoading(false);
      })
      .catch((err) => {
        setFileError(errorParser(err?.code));
        setFileUrl("");
        setLoading(false);
      });
  };

  const handleChangeN = (e) => {
    setN(e.target.value);
  };

  const handleChangeK = (e) => {
    setK(e.target.value);
  };

  const handleChangeEvalPoint = (e) => {
    setEvalPoint(e.target.value);
  }

  const errorParser = (errCode) => {
    if (errCode == "storage/object-not-found") {
      return "File not found. Please check the identification of resource";
    } else {
      return 'Undefined error';
    }
  };

  return (
    <div className="App">
      <div className="d-flex px-3 py-3">
        <div style={{ minWidth: "300px" }} className="px-3">
          <p>Records of Lowest-Bandwidth Repair Schemes for Short-Length Reed-Solomon Codes</p>
          <div className="d-flex w-100 justify-content-between mt-2">
            <label htmlFor="eval_point_selection">Evaluation points:</label>
            <select className='px-3' id="eval_point_selection" onChange={handleChangeEvalPoint}>
              <option value={'ISAL'} className="p-2">ISAL</option>
              <option value={'F16'} className="p-2">F16</option>
            </select>
          </div>
          <div className="d-flex w-100 justify-content-between mt-2">
            <div>Input n = </div>
            <div className='d-flex justify-content-between w-75'>
              <input
                className="ms-2"
                type="text"
                value={n}
                onChange={handleChangeN}
              ></input>
              <div>(4 ≤ n ≤ 16)</div>
            </div>
          </div>
          <div className="d-flex w-100 justify-content-between mt-2">
            <div>Input k = </div>
            <div className='d-flex justify-content-between w-75'>
              <input
                className="ms-2"
                type="text"
                value={k}
                onChange={handleChangeK}
              ></input>
              <div>(n-4 ≤ k ≤ n-2)</div>
            </div>
          </div>
          <div className="mt-2 pb-4" style={{borderBottom: '1px solid black'}}>
            <button className="rounded" onClick={getFileUrl}>
              {
                loading == true
                ? 'Loading...'
                : 'Submit'
              }
            </button>
          </div>
          <div>
              <ul>
                <li>Feedback sent to <a href="mailto:sonhoang.dau@rmit.edu.au">sonhoang.dau@rmit.edu.au</a></li>
                <li>Reference: T. X. Dinh et al, "Practical Considerations in repairing Reed-Solomon Codes," submitted to ISIT'22 </li>
              </ul>
          </div>
        </div>
        <div
          className="px-3"
          style={{
            borderLeft: "1px solid black",
            width: "1200px",
            height: "600px",
          }}
        >
          {fileUrl?.length > 0 && (
            <div
              className="h-100 w-100"
              dangerouslySetInnerHTML={{
                __html: `<iframe src=${fileUrl} style='width: 100%; height: 100%; overflow: auto;'></iframe>`,
              }}
            ></div>
          )}
          {fileError?.length > 0 && 
            <div>
              {fileError}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
