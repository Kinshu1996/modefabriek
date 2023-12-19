import "./App.scss";
import left_dot from "./assets/images/left_dot.png";
import right_dot from "./assets/images/right_dot.png";
import person_img from "./assets/images/person_img.svg";
import logo from "./assets/images/logo.svg";
import { useState } from "react";
import { Button, Input, InputNumber, Select } from "antd";
import codes from "country-calling-code";
import CountryFlagSvg from "country-list-with-dial-code-and-flag/dist/flag-svg";

function App() {
  const { Option } = Select;
  const [formDetails, setFormDetails] = useState({
    email: "",
    number: "",
  });
  const [errors, setErrors] = useState({});
  const [countryCode, setCountryCode] = useState("US");

  const prefixSelector = (
    <Select
      defaultValue="US"
      className="country_select"
      showSearch
      optionFilterProp="children"
      onChange={(e) => setCountryCode(e)}
      filterOption={(input, lab) =>
        lab?.children
          ? (
              lab?.children[lab?.children?.length - 2] +
              lab?.children[lab?.children?.length - 1]
            )?.includes(input) ||
            lab.value.toLocaleLowerCase().includes(input.toLocaleLowerCase())
          : ""
      }
    >
      {codes.map((elm) => (
        <Option key={elm.isoCode2} className="flag_option" value={elm.isoCode2}>
          <img
            alt=""
            width={20}
            height={20}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              CountryFlagSvg[elm.isoCode2]
            )}`}
          />{" "}
          +{elm.countryCodes[0]}
        </Option>
      ))}
    </Select>
  );

  const handleInputs = (e, type) => {
    if (errors.hasOwnProperty(e?.target?.name ?? type)) {
      let newObj = { ...errors };
      delete newObj[e?.target?.name ?? type];
      setErrors(newObj);
    }
    setFormDetails({
      ...formDetails,
      [e?.target?.name ?? type]: e?.target?.value ?? e,
    });
  };
  const handleValidations = () => {
    let tempErr = {};
    let pattern =
      /^(?!.*(?:''|\.\.))[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // for(let key in formDetails){
    //     if( !['number','organization'].includes(key) && formDetails[key] == ''){
    //         tempErr[key] = 'This field can not be empty'
    //     }
    // }
    if (formDetails.name == "") {
      tempErr["name"] = "Please enter your name";
    }

    if (
      formDetails.number != "" &&
      !(formDetails.number.toString().length == 10)
    ) {
      tempErr["number"] = "Enter a valid 10 digit number";
    }
    if (
      (formDetails.email != "" && !pattern.test(formDetails.email)) ||
      formDetails.email == ""
    ) {
      tempErr["email"] = "Enter a valid email address";
    }
    setErrors(tempErr);
    if (Object.keys(tempErr).length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (type) => {
    const result = await handleValidations();
    console.log(result);
    let tempObj = { ...formDetails };
    let prefixCode = codes.find((el) => el.isoCode2 == countryCode);
    let finalObj = {
      ...tempObj,
      number:
        tempObj.number == ""
          ? "--"
          : "+" + prefixCode.countryCodes + tempObj.number.toString(),
      organization: tempObj.organization == "" ? "--" : tempObj.organization,
      identifier: "FlixStudio",
    };
    if (result) {
      fetch("https://api-pegasus.flixstudio.io/limited/api/v1/inquiry", {
        // Return promise
        method: "POST",
        // withCredentials: true,
        // credentials: 'include',
        body: JSON.stringify(finalObj),
        headers: {
          "Content-Type": "application/json",
        },
      })
        // .then((res) => {
        //   if (res.status >= 200 && res.status < 300) {
        //     if (type == "booking") redirectToCalendly();
        //     else setSubmitFlag(true);
        //   }
        // })
        .then(
          (result) => {},
          (error) => {
            console.log(error);
          }
        );
    }
  };
  // const redirectToCalendly = (type) => {
  //   var a = document.createElement("a");
  //   a.target = "_blank";
  //   a.href = "https://calendly.com/madhur-khurana/30min?month=2023-08";
  //   a.click();

  //   if (type != "callback") {
  //     setSubmitFlag(true);
  //     setRedirected(true);
  //   } else props.setBookingFlag(false);
  // };

  console.log(formDetails);
  return (
    <div className="ciff-section">
      <div className="left-side-img side_img">
        <img src={left_dot} alt="left_dot" />
      </div>
      <div className="ciff-container">
        <div className="left-side">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="title">
            Hi👋, I’m Madhur. <br />
            Let’s walk and talk at CIFF?
          </div>
          <div className="form">
            <form>
              <div className="input">
                {/* <input placeholder='Enter email ID'  /> */}
                <Input
                  className="form_inputs"
                  placeholder="Enter email ID"
                  name="email"
                  onChange={(e) => handleInputs(e)}
                />
                {errors.email && (
                  <span className="error_class">{errors.email}</span>
                )}
              </div>
              <div className="input">
                <InputNumber
                  className="form_inputs"
                  placeholder="Enter Phone Number"
                  // controls={false}
                  addonBefore={prefixSelector}
                  min={0}
                  name="number"
                  onChange={(e) => handleInputs(e, "number")}
                />
                {errors.number && (
                  <span className="error_class">{errors.number}</span>
                )}
              </div>
              <div className="btn">
                <Button onClick={() => handleSubmit()}>Submit</Button>
              </div>
            </form>
          </div>
        </div>
        <div className="right-side">
          <img src={person_img} alt="img" className="person" />
        </div>
      </div>
      <div className="right-side-img side_img">
        <img src={right_dot} alt="right_dot" />
      </div>
    </div>
  );
}

export default App;
