import React, { useState, useEffect } from 'react'
import { Form, Input, message, Modal, Select, Table, DatePicker } from 'antd'
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import Spinner from "../components/Spinner"
import moment from 'moment'
import Analytics from '../components/Analytics'

const { RangePicker } = DatePicker;


const HomePage = () => {

  const [showModal, setshowModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [allTransactions, setallTransactions] = useState([]);
  const [frequency, setfrequency] = useState('7');
  const [selectedDate, setselectedDate] = useState([])
  const [type, settype] = useState('all');
  const [viewData, setviewData] = useState('table');
  const [editable, seteditable] = useState(null);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference'
    },
    {
      title: 'Actions',
      key: 'actions',

      render: (text, record) => (
        <div>
          <EditOutlined onClick={()=> {
            seteditable(record)
            setshowModal(true)
          }}/>
          <DeleteOutlined className='mx-2' onClick={()=>{handleDelete(record)}}/>
        </div>
      )
    },
  ]

  useEffect(() => {

    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setloading(true);
        const res = await axios.post('https://expense-tracker-backend-wcql.onrender.com/api/v1/transactions/get-transaction', { userId: user._id, frequency, selectedDate, type });

        const formattedTransactions = res.data.map(transaction => ({
          ...transaction,
          date: moment(transaction.date).format("YYYY-MM-DD")
        }));

        setloading(false);
        setallTransactions(formattedTransactions);

      } catch (error) {
        console.log(error);
        message.error("Failed to fetch transaction");
      }
    }

    getAllTransactions()
  }, [frequency, selectedDate, type]);

  const handleDelete=async(record)=>{
    try {
      setloading(true);
      await axios.post('https://expense-tracker-backend-wcql.onrender.com/api/v1/transactions/delete-transaction', {transactionId: record._id});
      setloading(false);
      message.success("Transaction Deleted")
      
    } catch (error) {
      setloading(false);
      console.log(error)
      message.error("Failed To Delete");
    }
  }


  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setloading(true);
      if(editable){
        await axios.post('https://expense-tracker-backend-wcql.onrender.com/api/v1/transactions/edit-transaction', {payload:{...values, userId: user._id}, transactionId: editable._id});
        setloading(false);
        message.success("Transaction Updated Successfully");
      }
      else{
        await axios.post('https://expense-tracker-backend-wcql.onrender.com/api/v1/transactions/add-transaction', { ...values, userId: user._id });
        setloading(false);
        message.success("Transaction added");
      }
      setshowModal(false);
      seteditable(null);
    } catch (error) {
      setloading(false);
      message.error("failed to add transaction");
    }
  }

  return (

    <Layout>
      {loading && <Spinner />}

      <div className='filters'>
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setfrequency(values)}>
            <Select.Option value="7">Last week</Select.Option>
            <Select.Option value="30">Last Month</Select.Option>
            <Select.Option value="365">Last Year</Select.Option>
            <Select.Option value="custom">Custom Range</Select.Option>
          </Select>

          {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setselectedDate(values)} />}

        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => settype(values)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>

        </div>
        <div className='switch-icons mx-2'>
          <UnorderedListOutlined
            className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setviewData('table')} />

          <AreaChartOutlined
            className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setviewData('analytics')} />
        </div>
        <div>
          <button className='btn btn-info' onClick={() => setshowModal(true)} >Add New Transaction</button>
        </div>
      </div>

      <div className='content'>
        {viewData==='table' ? <Table columns={columns} dataSource={allTransactions} />
        : <Analytics allTransactions={allTransactions}/>
      }
      </div>

      <Modal
        title={editable?"Edit transaction" : "Add transaction"}
        open={showModal}
        onCancel={() => setshowModal(false)}
        footer={false}
      >

        <Form layout='vertical' onFinish={handleSubmit} initialValues={editable}>

          <Form.Item label="amount" name="amount">
            <Input type='text' />
          </Form.Item>

          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
              <Select.Option value="fees">Fees</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="shopping">Shopping</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input type='text' />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input type='text' />
          </Form.Item>

          <Form.Item label="Date" name="date">
            <Input type='date' />
          </Form.Item>

          <div className='d-flex justify-content-end'>
            <button type='submit' className='btn btn-success'>SAVE</button>
          </div>

        </Form>

      </Modal>

    </Layout>
  )
}

export default HomePage
