

import LineChart from '../../Components/LineChart/LineChart';
import './Home.css'
import { useState,useEffect } from "react";

import { URL } from '../../Components/Helper/URL';

function Home(){    


    // const light1 =document.querySelector("device__light");
    const [turnOn, setTurnOn] = useState(JSON.parse(localStorage.getItem('turnOn')) ? JSON.parse(localStorage.getItem('turnOn')) : false );
    const [turnOn1, setTurnOn1] = useState(JSON.parse(localStorage.getItem('turnOn1')) ? JSON.parse(localStorage.getItem('turnOn1')) : false );
    const [turnOn2, setTurnOn2] = useState(JSON.parse(localStorage.getItem('turnOn2')) ? JSON.parse(localStorage.getItem('turnOn2')) : false );
    // const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [dataHome,setDataHome] = useState({
        temperature:"",
        humidity:"",
        light:"",
    });
    // const handleDataUpdate = (newData) =>{
    //     setChartData(newData);
    // }
    useEffect(() => {
        localStorage.setItem('turnOn', JSON.stringify(turnOn));
        localStorage.setItem('turnOn1', JSON.stringify(turnOn1));
        localStorage.setItem('turnOn2', JSON.stringify(turnOn2));
    }, [turnOn2,turnOn1,turnOn]);

    const fetchPostApi = async (numberTurnOn, device, turn) => {
        const option = {
          stt: "",
          device: `${device}`,
          action: numberTurnOn === true ? "Off" : "On",
          turn: `${turn}`,
          time: (() => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0"); // Tháng từ 0-11
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          })(),
        };
      
        try {
          const response = await fetch(URL + `/putAction`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-type": "application/json",
            },
            body: JSON.stringify(option),
          });
      
          const data = await response.json();
      
          if (response.ok && data.code === 200) {
            console.log("Đèn LED đã cập nhật thành công!");
            console.log(data);
            // Cập nhật giao diện tại đây, sau khi server phản hồi thành công
            if (option.action === "On") {
              console.log("Đèn đã bật!");
              // Gọi hàm hoặc cập nhật state để hiển thị trạng thái "On"
            } else if (option.action === "Off") {
              console.log("Đèn đã tắt!");
              // Gọi hàm hoặc cập nhật state để hiển thị trạng thái "Off"
            }
          } else {
            console.error("Lỗi từ server:", data.status);
            alert("Không thể cập nhật trạng thái đèn. Vui lòng thử lại!");
          }
        } catch (error) {
          console.error("Lỗi khi gửi yêu cầu đến server:", error);
          alert("Đã xảy ra lỗi kết nối. Vui lòng kiểm tra mạng!");
        }
      };

    // useEffect(() => {
    //     fetch('http://localhost:3001/load')
    //     .then(res => res.json())
    //     .then(data => {
    //         if(data){
    //             console.log(data.results);
    //         }
    //     })
    // },[])
    const handleTurnOnLight = () => {
        // const light =document.querySelector(".electric-light");
        // light.classList.toggle("show");
        setTurnOn(turnOn => !turnOn);
        fetchPostApi(turnOn,"light","data/light");
    }
    const handleTurnOnTemperature = () => {
        setTurnOn1(turnOn1 => !turnOn1);
        fetchPostApi(turnOn1,"temperature","data/light2");
    }
    const handleTurnOnAir = () => {
        setTurnOn2(turnOn2 => !turnOn2);
        fetchPostApi(turnOn2,"air","data/light3");
    }

    const handleDataUpdate = (data) =>{
        setDataHome({
            ...dataHome,
            temperature:data.temperature,
            humidity:data.humidity,
            light:parseInt(data.light),
         });
    }

    // console.log(dataHome.light);
   


    return(
        //
        <>
    <div class="main">
    <div className="section">
        <div className="section-one">
        <div className="sensor">
            <ul className="sensor-list">
            {/* Light Sensor */}
          <li className="sensor-item light">
            <div className="sensor-digit">{dataHome.light} Lux</div>
            <i className="fa-regular fa-sun"></i>
            <div className="sensor-bar">
              <div
                className="sensor-fill"
                style={{ height: `${dataHome.light}%` }}
              ></div>
            </div>
            <div className="label">Lights</div>
          </li>
          
          {/* Temperature Sensor */}
          <li className="sensor-item temperature">
            <div className="sensor-digit">{dataHome.temperature} °C</div>
            <i className="fa-solid fa-temperature-three-quarters"></i>
            <div className="sensor-bar">
              <div
                className="sensor-fill"
                style={{ height: `${dataHome.temperature}%` }}
              ></div>
            </div>
            <div className="label">Temperature</div>
          </li>
          
          {/* Humidity Sensor */}
          <li className="sensor-item humidity">
            <div className="sensor-digit">{dataHome.humidity}%</div>
            <i className="fa-solid fa-wind"></i>
            <div className="sensor-bar">
              <div
                className="sensor-fill"
                style={{ height: `${dataHome.humidity}%` }}
              ></div>
            </div>
            <div className="label">Humidity</div>
          </li>
            </ul>
        </div>
        <div className="chart">
            <div style={{ padding: '0px', marginBottom: "20px" }}>
            <LineChart onDataUpdate={handleDataUpdate} />
            </div>
        </div>
        <div className="electric">
            <ul className="electric-list">
            <li className="electric-item">
                <div className="electric-box">
                <input checked={turnOn} type="checkbox" className="electric-input" id="electric-input1" />
                <label htmlFor="electric-input1" className="electric-label" onClick={handleTurnOnLight}></label>
                </div>
                <div className="on-off">{turnOn ? "On" : "Off"}</div>
                <i className={turnOn ? "fa-regular fa-lightbulb electric-light show" : "fa-regular fa-lightbulb electric-light"}></i>
                <div className="light">Lights</div>
            </li>
            <li className="electric-item">
                <div className="electric-box">
                <input checked={turnOn1} type="checkbox" className="electric-input" id="electric-input2" />
                <label htmlFor="electric-input2" className="electric-label" onClick={handleTurnOnTemperature}></label>
                </div>
                <div className="on-off">{turnOn1 ? "On" : "Off"}</div>
                <i className={turnOn1 ? "fa-solid fa-temperature-three-quarters electric-temperature show" : "fa-solid fa-temperature-three-quarters electric-temperature"}></i>
                <div className="temperature">Temperature</div>
            </li>
            <li className="electric-item">
                <div className="electric-box">
                <input checked={turnOn2} type="checkbox" className="electric-input" id="electric-input3" />
                <label htmlFor="electric-input3" className="electric-label" onClick={handleTurnOnAir}></label>
                </div>
                <div className="on-off">{turnOn2 ? "On" : "Off"}</div>
                <i className={turnOn2 ? "fa-solid fa-fan electric-air show" : "fa-solid fa-fan electric-air"}></i>
                <div className="air-conditioner">Air conditioner</div>
            </li>
            </ul>
        </div>
        </div>
    </div>
    </div>

        </>
    )
};
export default Home;



