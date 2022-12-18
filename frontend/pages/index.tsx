import TaskAbi from "../../backend/build/contracts/TaskContract.json";
import { TaskContractAddress } from "../config";
import { ethers } from "ethers";
import { useState } from "react";

export default function TodoLost() {
  console.log({ ethers });

  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<any>([]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log({ chainId });

      const goerli = "0x5";
      if (chainId !== goerli) {
        console.log("not on goerli");
        setCorrectNetwork(false);
        return;
      } else {
        setCorrectNetwork(true);
      }

      const account = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setIsUserConnected(true);
      setCurrentAccount(account[0]);
      console.log({ account });
    } catch (err) {
      setIsUserConnected(false);
      console.log(err);
    }
  };

  const addTasks = async (e: any) => {
    e.preventDefault();

    let task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        taskContract.addTask(task.taskText, task.isDeleted).then((res: any) => {
          setTasks([...tasks, task]);
          console.log(res);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isUserConnected ? (
        <div>
          <h1>Todo List</h1>
          <ul>
            <li>Learn Next.js</li>
            <li>Learn React</li>
            <li>Learn GraphQL</li>
          </ul>
          <input type="text" onChange={(e) => setInput(e.target.value)} />
          <button onClick={addTasks}>addTasks</button>
        </div>
      ) : (
        <button onClick={connectWallet}>connect wallet</button>
      )}
    </div>
  );
}
