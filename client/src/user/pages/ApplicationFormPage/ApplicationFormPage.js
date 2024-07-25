import "./ApplicationFormPage.css";
import { useEffect, useState } from "react";
import axios from "axios";

function ApplicationForm() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    console.log("mounted ApplicationForm");
    let isMounted = true;
    async function fetchQuestions() {
      try {
        const res = await axios.get(
          process.env.REACT_APP_SERVER_URL + "/questions/",
          {
            withCredentials: true,
          }
        );
        if (isMounted) {
          setQuestions(res.data);
          setAnswers(
            res.data.reduce((obj, q, index) => {
              obj[`answer${index}`] = "";
              return obj;
            }, {})
          );
        }
      } catch (err) {
        console.error("Error:", err.response);
      }
    }

    fetchQuestions();
    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  const handleChange = (event) => {
    setAnswers({
      ...answers,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if any of the fields are empty
    for (let key in answers) {
      if (answers[key].trim() === "") {
        alert("Please fill out all fields.");
        return;
      }
    }

    const application = questions.map((question, index) => ({
      question,
      answer: answers[`answer${index}`],
    }));

    //submit the app, redirect to /thank-you, logout the user + error handle
    async function submitApp() {
      try {
        //submit the app to the server
        await axios.post(
          process.env.REACT_APP_SERVER_URL + "/applications/",
          application,
          {
            withCredentials: true,
          }
        );

        //log out the user
        await axios.get(process.env.REACT_APP_SERVER_URL + "/api/logout", {
          withCredentials: true,
        });
      } catch (err) {
        console.error("Error:", err);
      } finally {
        window.location.href = "/thank-you";
      }
    }
    submitApp();
  };

  return (
    <>
      <h1>Application Form</h1>
      <form className="qna-form" onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div className="qna" key={index}>
            <p className="question">{question}</p>
            <textarea
              className="answer"
              name={`answer${index}`}
              value={answers[`answer${index}`] || ""}
              onChange={handleChange}
            />
          </div>
        ))}
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default ApplicationForm;
