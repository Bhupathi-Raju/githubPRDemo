import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';


function App() {

  const [currentCode, setCurrentCode] = useState([]);
  let sha = ""

  useEffect(() => {
    getLatestCode()
  }, [])

  const getLatestCode = async () => {
    const code = await fetch('https://api.github.com/repos/Bhupathi-Raju/githubPRrequest/contents/test_policy?ref=new_branch', {
      method: 'GET',
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    })
    const body = await code.json()
    console.log("body is:", body)
    setCurrentCode(atob(body['content']))
    console.log("sha is:", body['sha'])
    sha = body['sha']
  }

  const createPullRequest = async () => {
    const resp1 = await updateFile()
    createPR()
  }


  const createPR = async () => {
    const request = await fetch('https://api.github.com/repos/Bhupathi-Raju/githubPRrequest/pulls', {
      method: 'POST',
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": "token 162ee8c8b1ebe4520c19a314742b14097d20348e"
      },
      body: JSON.stringify({
        "title": "Second PR from POSTMAN",
        "head": "new_branch",
        "base": "main",
        "body": "Updated content",
        "owner": "Bhupathi-Raju",
        "repo": "githubPRrequest"
      })
    })
    const body = await request.json()
    console.log("PR response", body)
  }

  const updateFile = async () => {
    const updated = await fetch('https://api.github.com/repos/Bhupathi-Raju/githubPRrequest/contents/test_policy', {
      method: 'PUT',
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": "token 162ee8c8b1ebe4520c19a314742b14097d20348e"
      },
      body: JSON.stringify({
        "message": "Third commit",
        "content": btoa(currentCode),
        "sha": "1dd64ad86f03ccae394db50689d1e76752b8b7e1",
        "branch": "new_branch"
      })
    })
    const body = await updated.json()
    console.log("updated file response", body)
  }



  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Editor
        value={currentCode}
        onValueChange={code => setCurrentCode(code)}
        highlight={code => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          margin: 'auto',
          marginTop: '100px'
        }}
      />
      <button style={{
        margin: 'auto',
        marginTop: '8px'
      }}
        onClick={() => {createPullRequest()}}>
        SAVE
  </button>
    </div>
  );
}

export default App;
