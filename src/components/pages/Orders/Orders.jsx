import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import {getSessionUser} from "../../../utils/session";
import {setUser} from "../../../store/slices/userSlice";
import {
  fetchOrdersList,
  fetchProductItems,
  selectOrderList,
  selectOrderListLoading,
  selectProductList,
  selectProductListLoading
} from "../../../store/slices/orderSlice";
import Table from '../../common/Table/Table';
import ReactLoading from 'react-loading';
import ROUTES from "../../../constants/routes";
import {useHistory} from "react-router-dom";
import {openWindow} from "../../../store/slices/signInSlice";
import {Helmet} from "react-helmet";

import './orders.scss';
import {getWallet} from "../../../utils/api";

const listcolumns = [
  {
    name: 'Date',
    field: 'orderDate',
    fieldType: 'timestamp'
  },
  {
    name: 'Payment ID',
    field: 'paymentId',
    fieldType: 'text'
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
const detailcolumns = [
  {
    name: 'Size',
    field: 'description',
    fieldType: 'text'
  },
  {
    name: 'Quantity',
    field: 'quantity',
    fieldType: 'text'
  },
  {
    name: 'Price',
    field: 'amount_total',
    fieldType: 'amount'
  }
];
const Orders = () => {
  const history = useHistory();
  const orderList = useSelector(selectOrderList);
  const loading = useSelector(selectOrderListLoading);
  const detailList = useSelector(selectProductList);
  const detailloading = useSelector(selectProductListLoading);
  const [stripeSessionId, setStripeSessionId] = useState(null);
  const dispatch = useDispatch()
  const [{accessToken, wallet}, setCookie] = useCookies(['accessToken', 'wallet']);

  const handleSelectRow = async (val) => {
    const {sessionId} = val;
    setStripeSessionId(sessionId);
    dispatch(fetchProductItems(sessionId));
  }

  useEffect(() => {
    if (!accessToken) {
      dispatch(openWindow());
      history.push(ROUTES.index);
    } else {
      const sessionUser = getSessionUser(accessToken);
      dispatch(setUser(sessionUser));
      dispatch(fetchOrdersList(accessToken));
      window.scrollTo(0, 0);
    }
  }, [accessToken, dispatch, history]);

  useEffect(() => {
    getWallet({ accessToken }).then((data) => {
      setCookie('wallet', data.data.wallet);
    });
  }, []);

  return (
    <div className="main-order">
      <Helmet>
      <title>Credits and Order History</title>
      <meta name="description" content="Please check your credits earned and order history" />
      <meta name="keywords" content="credits, artyst, order, history"/>
      </Helmet>
      {!loading ?
        <div className="main-order__order-table">
          <div ><h1 className="wallet-price" >Available Credits: A${wallet}</h1> </div>
          <div ><h1 className="wallet-price" >Order History</h1> </div>
          <Table data={orderList} columns={listcolumns} selectRow={handleSelectRow} enabledSelectRow={true}/>
        </div> :
        
        <div className="main-order__order-table__loading">
          
          <ReactLoading type="spinningBubbles" color='#8FCEB9' height={50} width={60}/>
        </div>
      }
      <div className="main-order__order-detailtable">
        {!loading && !detailloading && stripeSessionId &&
          <><Table data={detailList} columns={detailcolumns} noRowBorder={true} enabledSelectRow={false}/>
            <div className="total-price">
           
            </div>
          </>
        }
      </div>
    </div>
  )
}
export default Orders
