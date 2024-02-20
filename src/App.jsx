import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Result from './Components/result';

function App() {
  const [questions, setQuestions] = useState([])
  const [indexNum, setIndexNum] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [seconds, setSeconds] = useState(30)



  useEffect(() => {
    if (quizStarted) {
      fetchQuestions();
    }
  }, [quizStarted]);

  function fetchQuestions() {
    fetch('https://the-trivia-api.com/v2/questions')
      .then(res => res.json())
      .then(res => {
        const updatedQuestions = res.map(question => {
          const correctAnswer = question.correctAnswer
          const incorrectAnswers = question.incorrectAnswers

          const allAnswers = [...incorrectAnswers, correctAnswer]

          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5)

          return { ...question, answers: shuffledAnswers }
        });
        setQuestions(updatedQuestions)
      });
  };

  function startQuiz() {
    setQuizStarted(true);
  }

  function next() {
    const radioButtons = document.getElementsByName('q');
    radioButtons.forEach((radio) => {
      if (radio.checked && radio.value === questions[indexNum].correctAnswer) {
        setScore(score + 1);
      }
      radio.checked = false;
    });

    if (indexNum < questions.length - 1) {
      setIndexNum(indexNum + 1);
      setSeconds(30);
    } else {
      setShowResult(true);
    }
  }

  function restart() {
    const radioButtons = document.getElementsByName('q');
    radioButtons.forEach((button) => {
      button.checked = false;
    });

    setIndexNum(0);
    setScore(0);
    setSeconds(30)
    setShowResult(false);

  }

  useEffect(() => {
    let intervalId;

    if (quizStarted) {
      intervalId = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else {
          clearInterval(intervalId);
          // You can add any code you want to execute when the timer reaches zero
          next()
          console.log('Timer reached zero!');
        }
      }, 1000);
    }

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [quizStarted, seconds]);





  return (
    <div className="App">
      <header className="App-header flex justify-center flex-col gap-2 items-center w-full h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
        {!quizStarted ? (
          <button className="mx-auto border rounded-2xl p-2" onClick={startQuiz}>
            Start Quiz
          </button>
        ) : (
          <>
            {showResult ? (
              <div className='text-center w-full text-2xl'>
                <Result score={score} />
                <button className="border rounded-2xl p-2 mt-4" onClick={restart}>
                  Restart
                </button>
              </div>
            ) : (
              <div className='p-4 w-full h-full flex flex-col content-between gap-4 justify-around'>

                <p>Timer: {seconds} seconds</p>

                <h2 className='text-center text-4xl mt-4'>{questions[indexNum]?.question.text}</h2>

                <form className='text-2xl mt-4'>
                  {questions[indexNum]?.answers.map(function (item, index) {
                    return (
                      <div key={index} className='flex gap-2 flex-wrap text-2xl'>
                        <input
                          type="radio"
                          name='q'
                          id={`checkbox-${index}`}
                          value={item}
                        />
                        <label htmlFor={`checkbox-${index}`}>{item}</label>
                      </div>
                    );


                  })}
                </form>


                <div className="mt-6 ml-auto text-3xl">


                  {indexNum < questions.length - 1 ? (
                    <button className='ml-auto border rounded-2xl p-2' onClick={next}>
                      Next
                    </button>
                  ) : (
                    <button className="mx-auto border rounded-2xl p-2" onClick={next}>
                      Finish
                    </button>
                  )}

                </div>

              </div>
            )}

          </>
        )}

      </header>
    </div>
  );
}

export default App;
