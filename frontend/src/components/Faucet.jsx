import { useState, useEffect } from "react";
import { ethers } from "ethers";
import faucetABI from "./Faucet.json";
import { motion } from "framer-motion";

const contractAddress = "0xb6c97D1aDd819561DFe85FA0eD6F91344BD79d5A";

const Faucet = () => {
	const [balance, setBalance] = useState(0);
	const [joke, setJoke] = useState({ setup: "", punchline: "" });
	const [contract, setContract] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showPunchline, setShowPunchline] = useState(false);

	useEffect(() => {
		const initialize = async () => {
			if (window.ethereum) {
				try {
					if (!window.ethereum.isConnected()) {
						await window.ethereum.request({ method: "eth_requestAccounts" });
					}
					const provider = new ethers.BrowserProvider(window.ethereum);
					const signer = await provider.getSigner();
					const contractInstance = new ethers.Contract(
						contractAddress,
						faucetABI,
						signer
					);
					setContract(contractInstance);

					const userBalance = await contractInstance.theBalance();
					setBalance(ethers.formatEther(userBalance));
				} catch (err) {
					console.error(err.message);
				}
			} else {
				console.error("MetaMask is not installed");
			}
		};

		initialize();
	}, []);

	const claimTokens = async () => {
		if (!contract) return;
		try {
			await contract.mintDailyAmount();
			const userBalance = await contract.theBalance();
			setBalance(ethers.formatEther(userBalance));
		} catch (err) {
			alert(err.reason || err.message);
		}
	};

	const generateJoke = async () => {
		if (!contract) return;
		setIsLoading(true);
		setShowPunchline(false);
		try {
			await contract.generatejoke();
			const userBalance = await contract.theBalance();
			setBalance(ethers.formatEther(userBalance));

			const response = await fetch(
				"https://official-joke-api.appspot.com/random_joke"
			);
			const data = await response.json();
			setJoke({ setup: data.setup, punchline: data.punchline });
		} catch (err) {
			alert(err.reason || err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container">
			<div className="menu-bar">
				<button className="claim-button" onClick={claimTokens}>
					Claim Token
				</button>
				<p className="balance">Balance: {balance} STK</p>
			</div>
			<div className="content-box">
				<h1 className="title">Tokenized Fun Generator</h1>
				<motion.div
					className="joke-box"
					initial={{ scale: 0.8 }}
					animate={{ scale: 1 }}
				>
					{!joke.setup && (
						<p className="joke-title">Click the button and get a joke...</p>
					)}
					{isLoading ? (
						<div className="loader">
							<motion.div
								className="loader-dot"
								animate={{
									scale: [1, 1.5, 1],
									opacity: [1, 0.5, 1],
								}}
								transition={{
									duration: 1,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
							<motion.div
								className="loader-dot"
								animate={{
									scale: [1, 1.5, 1],
									opacity: [1, 0.5, 1],
								}}
								transition={{
									duration: 1,
									repeat: Infinity,
									ease: "easeInOut",
									delay: 0.2,
								}}
							/>
							<motion.div
								className="loader-dot"
								animate={{
									scale: [1, 1.5, 1],
									opacity: [1, 0.5, 1],
								}}
								transition={{
									duration: 1,
									repeat: Infinity,
									ease: "easeInOut",
									delay: 0.4,
								}}
							/>
						</div>
					) : (
						joke.setup && (
							<div>
								<p className="joke">{joke.setup}</p>
								{showPunchline && (
									<p className="joke punchline">{joke.punchline}</p>
								)}
								{!showPunchline && (
									<motion.button
										className="reveal-button"
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => setShowPunchline(true)}
									>
										Reveal Punchline
									</motion.button>
								)}
							</div>
						)
					)}
				</motion.div>
				<motion.button
					className="generate-button"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={generateJoke}
				>
					Generate Joke (2 tokens)
				</motion.button>
				<div className="disclaimers">
					<h5>Minting Tockens is limited to once per hour.</h5>
				</div>
			</div>
		</div>
	);
};

export default Faucet;
