import React, {useState, useEffect} from "react";
import {toast} from 'react-toastify';
import { getNames} from './api';
import {Link} from "react-router-dom";
import FormElement from "./Form";
import Loading from "./Loading";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";

const Crud = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [names, setNames] = useState ([]);

    userEffect(() => {
        loadingNames();
    }, []);

    const loadingNames = () => getNames().then((name) => setNames(name.data));
    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                    {Loading ? <Loading/> : (
                        <h4 className="text-center">Crud com Json Server</h4>
                        {names && names.map((t) => (
                            <div className="border row mx-2 align-itens-center" key={t.id}>
                                <ul className="list-group">
                                    <li className="list-group-item">{t.name}</li>
                                </ul>
                                <span
                                    onClick={() => console.log("")}
                                    className="btn btn-sm float-right"
                                >
                                    <DeleteOutlined className="text-danger" />
                                </span>
                                <Link to={`/update/${t.id}`}>
                                    <span
                                        onClick={() => console.log("")}
                                        className="btn btn-sm float-right"
                                    >
                                        <EditOutlined className="text-warning" />
                                    </span>
                                </Link>
                            </div>
                        )))}
                </div>
            </div>
        </div>
    )
};

export default Crud;
