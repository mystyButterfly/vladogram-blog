import React, { useState } from 'react';
import API from '../api/axios';

export default function CreateNewPost() {
  const [title, settitle] = useState('');
  const [body, setbody] = useState('');
  const [author, setauthor] = useState(5);

  const add = async () => {
    try {
      const res = await API.post('/post/', { title, body, author });
      alert('added!');
      console.log(res)
    } catch (error) {
      console.error(error);
      alert('add failed');
    }
  };

  return (
    <div>
      <h2>add</h2>
       <input placeholder="author" onChange={(e) => setauthor(e.target.value)} />
      <input placeholder="title" onChange={(e) => settitle(e.target.value)} />
      <input placeholder="body" type="body" onChange={(e) => setbody(e.target.value)} />
      <button onClick={add}>Add</button>
    </div>
  );
}
