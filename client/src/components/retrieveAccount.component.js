import {Component} from "react";
import { Link } from "react-router-dom";
import UserServices from "../services/user.services";
import {Col, FormControl, InputGroup} from "react-bootstrap";


class RetrieveAccountComponent extends Component {

    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeToken = this.onChangeToken.bind(this);
        this.handleSendVeriCode = this.handleSendVeriCode.bind(this);
        this.handleRest = this.handleRest.bind(this);

        this.state = {
            submitted: false,

            username: "",
            password: "",
            token: "",
            loading: false,
            sendCodeFrozen: false,

            errMsg: "",
            tokenSentMsg: "",
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value,
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value,
        });
    }

    onChangeToken(e) {
        this.setState({
            token: e.target.value,
        });
    }

    handleSendVeriCode(e) {
        e.preventDefault();
        this.setState({
            errMsg: "",
            tokenSentMsg: "",
            loading: false,
            sendCodeFrozen: true,
        });


        UserServices.retrieveSendCode(this.state.username)
            .then( res => {
                this.setState({
                    tokenSentMsg: res.data.message,
                    signupSendVeriFrozen: false,
                    errMsg: "",
                })
            })
            .catch( error => {
                const errMsg =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message || error.toString();

                this.setState({
                    tokenSentMsg: "",
                    sendCodeFrozen: false,
                    errMsg: errMsg,
                    loading: false,
                })
            })
    }

    handleRest(e) {
        e.preventDefault();

        this.setState({
            errMsg: "",
            tokenSentMsg: "",
            loading: false,
            sendCodeFrozen: true,
        });

        UserServices.retrieveReset(this.state.username, this.state.password, this.state.token)
            .then( res => {
                this.setState({
                    errMsg: "",
                    tokenSentMsg: "",
                    loading: false,
                    sendCodeFrozen: false,
                    submitted: true,
                });
            })
            .catch( error => {
                const errMsg =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message || error.toString();
                this.setState({
                    errMsg: errMsg,
                    tokenSentMsg: "",
                    loading: false,
                    sendCodeFrozen: false,
                    submitted: false,
                })
            })


    }


    render() {
        const { submitted, errMsg } = this.state;
        return (
            <div>
                {!submitted ? (
                    <div className="justify-content-md-center" >
                        <h4>Reset your password</h4>
                        <div className="input-div">
                            <form>
                                <InputGroup className="mb-lg-3">
                                    <InputGroup.Text>
                                        Username
                                    </InputGroup.Text>
                                    <FormControl
                                        placeholder="NetID@cornell.edu"
                                        onChange={this.onChangeUsername}
                                        value={this.state.username}
                                    />
                                </InputGroup>
                                <InputGroup className="mb-lg-3">
                                    <InputGroup.Text>
                                        New Password
                                    </InputGroup.Text>
                                    <FormControl
                                        type="password"
                                        placeholder="Your Password"
                                        onChange={this.onChangePassword}
                                        value={this.state.password}
                                    />
                                </InputGroup>
                                <InputGroup className="mb-lg-3">
                                    <InputGroup.Text>
                                        Verification Code
                                    </InputGroup.Text>
                                    <FormControl
                                        type="text"
                                        placeholder="Verification Code"
                                        onChange={this.onChangeToken}
                                        value={this.state.token}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        disabled={!this.state.username}
                                        onClick={this.handleSendVeriCode}
                                    >
                                        Get Code
                                    </button>
                                </InputGroup>
                                {this.state.tokenSentMsg && (
                                    <div className="alert-success">
                                        {this.state.tokenSentMsg}
                                    </div>
                                )}

                                <button
                                    className="btn btn-outline-primary btn-block"
                                    disabled={!this.state.username ||
                                    !this.state.password ||
                                    !this.state.token ||
                                    this.state.loading }
                                    onClick={this.handleRest}
                                >
                                    Submit
                                </button>
                                {errMsg && (
                                    <div className="alert alert-danger">
                                        {errMsg}
                                    </div>
                                )}
                            </form>

                        </div>



                    </div>
                ) : (
                    <div className="container-sm">
                        <div className="alert-success">
                            <span>The password of your account has been reset.</span>
                        </div>
                        <Link to="/login">
                            <button className="btn btn-outline-primary btn-block"
                            >
                                Log in
                            </button>
                        </Link>


                    </div>
                )}


            </div>
        );
    }
}

export default RetrieveAccountComponent;