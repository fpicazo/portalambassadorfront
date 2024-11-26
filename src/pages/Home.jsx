import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

const Home = () => {
  const { userId } = useContext(AuthContext); // Fetch ambasador ID from context
  const [qrCode, setQrCode] = useState(""); // State to hold the QR code data
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQrCode = async () => {
      console.log("Fetching QR code...");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}ambassadors/generate-qrcode?ambasador=${userId}`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch QR code.");
        }

        const qrCodeHtml = await response.text(); // Backend returns HTML with the QR code image
        setQrCode(qrCodeHtml); // Save the QR code to state
      } catch (err) {
        console.error("Error fetching QR code:", err);
        setError("Failed to load QR code. Please try again later.");
      }
    };

    if (userId) {
      fetchQrCode(); // Fetch QR code if token is available
    }
  }, [userId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "QR Code",
          text: "Scan this QR code to participate!",
          url: `https://survey.zohopublic.com/zs/KwCNfu?ambasador=${encodeURIComponent(
            userId
          )}`, // Share the original URL
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const handleDownload = () => {
    const qrCodeImg = document.querySelector(".qr-code img"); // Select the QR code image
    if (qrCodeImg) {
      const link = document.createElement("a");
      link.href = qrCodeImg.src; // Get the image source
      link.download = "qr-code.png"; // Set the file name
      link.click(); // Trigger the download
    } else {
      alert("QR code not available for download.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-900">Please see below your QR Code</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div
        className="mt-4 qr-code"
        dangerouslySetInnerHTML={{ __html: qrCode }}
      ></div> {/* Render QR code */}
      <div className="flex mt-4 space-x-4">
        <button
          onClick={handleShare}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Share
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Download QR Code
        </button>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mt-8">How it works?</h1>
      <div className="mt-4 space-y-4 text-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Step 1</h2>
          <p className="text-sm text-gray-600">
            Share this QR code with your audience to allow them to scan and participate.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Step 2</h2>
          <p className="text-sm text-gray-600">
            Participants will scan the code and be directed to the survey page.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Step 3</h2>
          <p className="text-sm text-gray-600">
            Track responses and manage participants through your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
