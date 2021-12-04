import React from "react";
import {Imput} from "antd";

const FormElement = ({handleSubmit, name, setName}) => (
    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <Imput
                type="text"
                placeholder="Nome"
                value={name}
                style={{ with: "50%" }}
                autoFocus
                required
            />
            <br/>
            <button className="btn btn-primary mt-1">Salvar</button>
            <button className="btn btn-danger mt-1" onClick={() => setName("")}>Cancelar</button>
        </div>
    </form>
);

export default FormElement;