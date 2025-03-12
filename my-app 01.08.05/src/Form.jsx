import React,{useState} from 'react';
import axios from 'axios';


const Form = () => {

    const onSubmit = async (e) => {
        console.log("Form submitted");
        e.preventDefault();
        const data = { };
        // const data = {
        //     item1: e.target.item1.value,
        //     price_unit1: e.target.price_unit1.value,
        //     quant1: e.target.quant1.value,
        //     total1: e.target.total1.value,
        //     item2: e.target.item2.value,
        //     price_unit2: e.target.price_unit2.value,
        //     quant2: e.target.quant2.value,
        //     total2: e.target.total2.value,
        //     item3: e.target.item3.value,
        //     price_unit3: e.target.price_unit3.value,
        //     quant3: e.target.quant3.value,
        //     total3: e.target.total3.value,
        //     item4: e.target.item4.value,
        //     price_unit4: e.target.price_unit4.value,
        //     quant4: e.target.quant4.value,
        //     total4: e.target.total4.value,
        //     item5: e.target.item5.value,
        //     price_unit5: e.target.price_unit5.value,
        //     quant5: e.target.quant5.value,
        //     total5: e.target.total5.value,
        // }
        await axios.post('http://localhost:3001/invoice',data)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return(
    <form onSubmit={onSubmit} method="POST">
        <table>
        <tr>
            <td><input type="text" item="item1" placeholder="Item 1"/></td>
            <td><input type="number" item="price/unit1" placeholder="Price/Unit 1"/></td>
            <td><input type="number" item="quant1" placeholder="Quantity 1"/></td>
            <td><input type="text" item="total1" placeholder="Total 1"/></td>
        </tr>
        <tr>
            <td><input type="text" item="item2" placeholder="Item 2"/></td>
            <td><input type="number" item="price/unit2" placeholder="Price/Unit 2"/></td>
            <td><input type="number" item="quant2" placeholder="Quantity 2"/></td>
            <td><input type="text" item="total2" placeholder="Total 2"/></td>
        </tr>
        <tr>
            <td><input type="text" item="item3" placeholder="Item 3"/></td>
            <td><input type="number" item="price/unit3" placeholder="Price/Unit 3"/></td>
            <td><input type="number" item="quant3" placeholder="Quantity 3"/></td>
            <td><input type="text" item="total3" placeholder="Total 3"/></td>
        </tr>
        <tr>
            <td><input type="text" item="item4" placeholder="Item 4"/></td>
            <td><input type="number" item="price/unit4" placeholder="Price/Unit 4"/></td>
            <td><input type="number" item="quant4" placeholder="Quantity 4"/></td>
            <td><input type="text" item="total4" placeholder="Total 4"/></td>
        </tr>
        <tr>
            <td><input type="text" item="item5" placeholder="Item 5"/></td>
            <td><input type="number" item="price/unit5" placeholder="Price/Unit 5"/></td>
            <td><input type="number" item="quant5" placeholder="Quantity 5"/></td>
            <td><input type="text" item="total5" placeholder="Total 5"/></td>
        </tr>
    </table>
    <button >Submit</button>   
    </form>
    );
    
}

export default Form;