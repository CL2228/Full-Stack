import { Component } from "react";
import {Link, useParams} from "react-router-dom";
import UserServices from "../services/user.services";
import PostServices from "../services/post.services";
import getJWTHeader from "../services/jwtHeader.services";
import Config from "../config/config";


class NewPostComponent extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.verifyUser = this.verifyUser.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeImages = this.onChangeImages.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {

            loading: true,
            logged: false,

            posted: false,
            user: undefined,

            editPostId: "",
            editTitle: "",
            editDescription: "",
            editPrice: "",
            editImages: [],
            imgPreviewUrls: [],

            errMsg: "",
        }
    }

    logout() {
        UserServices.logout();
    }

    verifyUser() {
        return UserServices.verifyUser(getJWTHeader())
            .then((res) => {
                this.setState({
                    logged: true,
                    user: res.data.user
                });
            })
            .catch((error) => {
                const errMsg =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message || error.toString();

                this.logout();

                this.setState({
                    user: undefined,
                    errMsg: "Please Log in (again)",
                    logged: false,
                });
            })
    }

    /********************************************************************
     * Edit the post
     ********************************************************************/
    onChangeTitle(e) {
        this.setState({
            editTitle: e.target.value
        })
    }

    onChangeDescription(e) {
        this.setState({
            editDescription: e.target.value
        })
    }

    onChangePrice(e) {
        this.setState({
            editPrice: e.target.value
        })
    }

    onChangeImages(e) {
        let fileObj = Object.values(e.target.files);
        let imgPreviewUrls = [];

        fileObj.forEach( (f) => {
            imgPreviewUrls.push(URL.createObjectURL(f));
        });

        this.setState({
            editImages: fileObj,
            imgPreviewUrls: imgPreviewUrls
        });

        console.log(this.state);
    }

    handleSubmit(e) {
        e.preventDefault();

        console.log(this.state.user);

        let formData = new FormData();
        formData.append("title", this.state.editTitle);
        formData.append("description", this.state.editDescription);
        formData.append("price", this.state.editPrice);
        formData.append("user", this.state.user.username);
        this.state.editImages.forEach( img => {
            formData.append("images", img);
        });

        this.setState({
            loading: true,
        });

        PostServices.createPost(formData)
            .then((res) => {
                this.setState({
                    loading: false,
                    posted: true,
                    errMsg: "",
                })

            })
            .catch((error) => {
                const errMsg =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message || error.toString();


                this.setState({
                    errMsg: errMsg,
                    loading: false,
                    posted: false,
                });
            })

    }



    componentDidMount() {
        this.verifyUser()
            .then(() => {
                this.setState({
                    loading: false,
                });
            });
    }

    render() {
        const {loading, logged, posted, user, errMsg, imgPreviewUrls} = this.state;

        return (
            <div className="main-div">
                {!loading ? (
                    // loaded successfully--------------------------------------------
                    <div>
                        {logged ? (
                            // logged in verification passed--------------------------
                            <div>
                                {!posted ? (
                                    <div>
                                        <h4>Create a new Post</h4>
                                        <div className="card-container">
                                            <form>
                                                Title: <input type="text" onChange={this.onChangeTitle} value={this.state.editTitle}/>
                                                <br/>
                                                Description: <input type="text" onChange={this.onChangeDescription} value={this.state.editDescription}/>
                                                <br/>
                                                Price: <input type="text" onChange={this.onChangePrice} value={this.state.editPrice}/>
                                                <br/>
                                                Photos: <input type="file" onChange={this.onChangeImages} multiple/>
                                                <br/>
                                                <button className="btn-success" onClick={this.handleSubmit} disabled={loading}>
                                                    Submit
                                                </button>
                                            </form>
                                            {errMsg && (
                                                <div className="form-group">
                                                    <div className="alert alert-danger" role="alert">
                                                        {errMsg}
                                                    </div>
                                                </div>
                                            )}
                                            {imgPreviewUrls && imgPreviewUrls.map( (srcUrl) => (
                                                <img src={srcUrl} width="40%"/>
                                            ))}

                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h5>{"Posted successfully!"}</h5>
                                        <Link to={"/"}>
                                            <button className="btn-primary">Home Page</button>
                                        </Link>
                                        <button className="btn-primary"
                                                onClick={() => {
                                                    window.location.reload();
                                                }}>
                                            Create a new one!
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h4>Please log in first</h4>
                                <Link to={"/login"}>
                                    <button className="btn-primary">
                                        Login / Signup
                                    </button>
                                </Link>
                            </div>
                        )}

                    </div>
                ) : (
                    // still loading---------------------------------------------------
                    <div>
                        <h5>Processing...</h5>
                    </div>

                )}

            </div>
        );
    }
}


export default NewPostComponent;