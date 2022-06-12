import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Editor from "@monaco-editor/react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import './App.css';

function App() {

  const [job_name, setJobName] = useState(" ");
  const [no_of_occurence, setNoOfOccurence] = useState(" ");
  const [time_interval, setTimeInterval] = useState(" ");
  const [queueID, setQueueID] = useState(" ");

  const [new_job_ID, setNewJobID] = useState(" ");
  const [job_content, setJobContent] = useState(" ");

  const [fetched_job_id, setFetchedJobID] = useState(" ");

  const [fetched_job, setFetchedJob] = useState("");

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };

  }

  // const rows = [
  //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  //   createData('Eclair', 262, 16.0, 24, 6.0),
  //   createData('Cupcake', 305, 3.7, 67, 4.3),
  //   createData('Gingerbread', 356, 16.0, 49, 3.9),
  // ];

  const [rows, setRows] = useState([])



  const sendSchedule = (schedule) => {
    console.log(schedule)
    axios.post('http://localhost:8080/schedule', schedule).then(
      (response) => {
        console.log(response)

      })
      .catch(
        (err) => {
          console.log(err)
        });
  }

  const sendJobContent = (job_id, job_content) => {
    const job = {
      "job_id": job_id,
      "job_content": job_content
    }
    console.log(`job object : ${job}`)
    axios.post('http://localhost:8080/deploy-job', job).then(
      (response) => { console.log(`response : ${response}`) })
      .catch(
        (err) => {
          console.log(err)
        });
  }


  const getExeResults = () => {
    axios.get('http://localhost:8080/get-execution-result').then(
      (response) => {
        console.log(response.data.result)
        // l.map((u)=>{
        //   name:u[0],
        //   age:u[1]
        // })
        // job_name, worker_id, status, start_time, end_time, utl_raw.cast_to_varchar2(result)
        const exe_result = response.data.result.map((u) => {
          return {
            job_name: u[0],
            Worker_id: u[1],
            status: u[2],
            start_time : u[3],
            end_time : u[4],
            result : u[5]
          }
        })
        setRows(exe_result)
        // for (var i = 0; i<response.data.result.length; i++) {

        // }


        response.data.result.map((u) => {

        })

      })
      .catch(
        (err) => {
          console.log(err)
        });
  }



  function handleEditorChange(value, event) {
    setJobContent(value)
  }


  const fetchJobByJobID = (job_id) => {
    return new Promise((resolve, reject) => {
      const job_id_obj = {
        "job_id": job_id
      }
      axios.post('http://localhost:8080/get-job-content-by-job-id', job_id_obj).then(
        (response) => { resolve(response.data) })
        .catch(
          (err) => {
            reject(err)
          });
    })

  }

  // job_name, status, result, start_time, end_time




  return (
    <div>
      <div>
        <br />
        <TextField id="outlined-basic" label="Enter job ID" variant="outlined" onChange={(e) => { setJobName(e.target.value) }} />
        <br />
        <br />
        <TextField id="outlined-basic" label="Enter no of occurence" variant="outlined" onChange={(e) => { setNoOfOccurence(e.target.value) }} />
        <br />
        <br />
        <TextField id="outlined-basic" label="Enter time interval" variant="outlined" onChange={(e) => { setTimeInterval(e.target.value) }} />
        <br />
        <br />
        <TextField id="outlined-basic" label="Enter queue ID" variant="outlined" onChange={(e) => { setQueueID(e.target.value) }} />
        <br />
        <br />
        <Button variant="contained" onClick={() => {
          sendSchedule({
            "job_name": job_name,
            "no_of_occurence": no_of_occurence,
            "time_interval": time_interval,
            "queue_id": queueID
          })
        }}>SUBMIT</Button>
        <br />
        <br />
      </div>

      <div>
        <TextField id="outlined-basic" label="Enter job ID" variant="outlined" onChange={(e) => { setNewJobID(e.target.value) }} />
        <br />
        <br />
        {/* <TextField id="outlined-basic" label="Job content" variant="outlined" onChange={(e) => {setJobContent(e.target.value)}} /> */}
        <div>
          <Editor
            height="50vh"
            width="50%"
            defaultLanguage="python"
            defaultValue="# type your code here"
            theme="vs-dark"
            onChange={handleEditorChange}
          />

        </div>


        <br />
        <br />
        <Button variant="contained" onClick={() => {
          sendJobContent(new_job_ID, job_content)
        }}>SUBMIT</Button>
        <br />
        <br />
      </div>


      <div>
        <TextField id="outlined-basic" label="Enter job ID to fetch job" variant="outlined" onChange={(e) => { setFetchedJobID(e.target.value) }} />
        <br />
        <br />
        <Button variant="contained" onClick={() => {
          fetchJobByJobID(fetched_job_id).then((job) => {
            console.log(job);
            setFetchedJob(job.job);
          }).catch((err) => {
            console.log(err)
          })
          // console.log(job)
        }}>SUBMIT</Button>
        <div style={{ "whiteSpace": "pre-line" }}>{fetched_job}</div>
      </div>


      <div>
        <div>
          <br />
          <br />
          <Button variant="contained" onClick={() => {
            getExeResults().then((exe_res) => {
              setRows(exe_res)
            })
          }}>GET EXECUTION RESULTS</Button>
        </div>



        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align='left'>job name</TableCell>
            <TableCell align="left">worker ID</TableCell>
            <TableCell align="left">status</TableCell>
            <TableCell align="left">start time</TableCell>
            <TableCell align="left">end time</TableCell>
            <TableCell align="left">result</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, value) => (
            <TableRow
              key={value}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.job_name}
              </TableCell>
              <TableCell align="left">{row.Worker_id}</TableCell>
              <TableCell align="left">{row.status}</TableCell>
              <TableCell align="left">{row.start_time}</TableCell>
              <TableCell align="left">{row.end_time}</TableCell>
              <TableCell align="left">{row.result}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

      </div>

    </div>
  );
}

export default App;
