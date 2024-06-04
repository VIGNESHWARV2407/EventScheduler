import React, { useState } from 'react';
import emailjs from '@emailjs/browser';


const email = () => {

    const [name,setName] = useState('');
    const [toemail,setToemail] = useState('');
    const [message,setMessage] = useState('');


    const handleSubmit = (e) =>
    {
        e.preventDefault();
        const serviceID="service_5gwriys";
        const templateID="template_x24m7nv";
        const publicKey ="7Y-1YW-rf8ab8o0C9";

        const templateParams =
        {
            from_name:"SchedX",
            to_email:toemail,
            to_name:"Event Scheduler",
            message:message,
        };


        emailjs.send(serviceID,templateID,templateParams,publicKey)
        .then((response)=>
        {
            console.log("Email sent Successfully",response);
            setName('');
            setMessage('');
        })
        .catch((error)=>
        {
            console.log("Something went wrong",error);
        });
    }

  return (
    
    <form onSubmit={handleSubmit} style={{paddingTop:"20px"}}>
    <h3 style={{paddingTop:"50px"}}>Send Request</h3>
    <br/><br/>To <br/> 
    <input //TO
     type='text'
     placeholder='To'
     value={toemail}
     style={{padding:"5px",borderRadius:"5px"}}
     onChange={(e)=>setToemail(e.target.value)}
    />
    <br/><br/>Subject <br/> 
      <input // subject
      type='text'
      placeholder='Subject'
      value={name}
      style={{padding:"5px",borderRadius:"5px"}}
      onChange={(e)=>setName(e.target.value)}
      />
      <br/><br/>Request<br/> 
      <textarea  // message request
      placeholder='Your Request'
      value={message}
      onChange={(e)=>setMessage(e.target.value)}
      ></textarea>
      <br/><br/> 
      <button type='submit' style={{color:"white",backgroundColor:"black",padding:"6px 10px",borderRadius:"10px"}}>Send</button>
    </form>
  )
}

export default email
