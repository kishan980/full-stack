import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { getSessionUser } from "../../../utils/session";
import { setUser } from "../../../store/slices/userSlice";
import { fetchOrdersList, fetchProductItems, selectOrderList, selectOrderListLoading, selectProductList, selectProductListLoading } from "../../../store/slices/orderSlice";
import Table from '../../common/Table/Table';
import ReactLoading from 'react-loading';
import { openWindow } from "../../../store/slices/signInSlice";
import ROUTES from "../../../constants/routes";
import { useHistory } from "react-router-dom";

import './transactions.scss';
const listcolumns = [
    {
        name: 'Payment ID',
        field: 'paymentId',
        fieldType: 'text'
    },
    {
        name: 'Date',
        field: 'orderDate',
        fieldType: 'timestamp'
    },
    {
        name: 'Amount',
        field: 'totalPrice',
        fieldType: 'amount'
    },
    {
        name: 'Status',
        field: 'status',
        fieldType: 'text'
    }
];

const Orders = () => {

    const orderList = useSelector(selectOrderList);
    const loading = useSelector(selectOrderListLoading);
    const dispatch = useDispatch()
    const [{ accessToken }] = useCookies(['accessToken']);
    const history = useHistory();
    useEffect(() => {
        if (!accessToken || accessToken == 'undefined') {
            dispatch(openWindow());
            history.push(ROUTES.index);
        } else {
            const sessionUser = getSessionUser(accessToken);
            dispatch(setUser(sessionUser));
            dispatch(fetchOrdersList(accessToken));
            window.scrollTo(0, 0);
        }

    }, [accessToken, dispatch, history])

    const handleSelectRow = async (val) => {
        const { sessionId } = val;
        dispatch(fetchProductItems(sessionId));
    }
    return (

        <div className="main-transaction">
            {!loading ?
                <div className="main-transaction__table">
                    <Table data={orderList} columns={listcolumns} selectRow={handleSelectRow} enabledSelectRow={true} />
                </div> :
                <div className="main-transaction__table__loading">
                    <ReactLoading type="spinningBubbles" color='#8FCEB9' height={50} width={60} />
                </div>
            }

        </div>
    )
}
export default Orders
