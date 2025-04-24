import Q from "q";

type Queue = number | ((n: number) => number);

const getFinalState = (baseState: number, queue: Queue[]) => {
  let finalState = baseState;
  for(let i=0;i<queue.length;i++)
  {
    if(typeof queue[i] === 'function')
    {
        finalState=increment(finalState);
    }
    else
    {
         finalState=queue[i] as number;
    }
  
  }

  // TODO: do something with the queue...

  return finalState;
};

const increment = (n: number) => {
  return n + 1;
};

increment.toString = () => 'n => n + 1';

export default function TestStateQueue() {
  return (
    <>
      <TestCase baseState={0} queue={[1, 1, 1]} expected={1} />
      <hr />
      <TestCase
        baseState={0}
        queue={[increment, increment, increment]}
        expected={3}
      />
      <hr />
      <TestCase baseState={0} queue={[5, increment]} expected={6} />
      <hr />
      <TestCase baseState={0} queue={[5, increment, 42]} expected={42} />
    </>
  );
}

type TestCaseProps = {
  baseState: number;
  queue: Queue[];
  expected: number;
};

function TestCase({ baseState, queue, expected }: TestCaseProps) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>
        Base state: <b>{baseState}</b>
      </p>
      <p>
        Queue: <b>[{queue.join(', ')}]</b>
      </p>
      <p>
        Expected result: <b>{expected}</b>
      </p>
      <p
        style={{
          color: actual === expected ? 'green' : 'red',
        }}
      >
        Your result: <b>{actual}</b> (
        {actual === expected ? 'correct' : 'wrong'})
      </p>
    </>
  );
}
