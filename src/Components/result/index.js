function Result(props) {
    return (
        <div className='text-center w-full text-2xl'>
            <p className='text-center text-3xl mt-4'>Your Score: {props.score} </p>
        </div>
    );
}

export default Result;