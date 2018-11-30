/*
  Hari Kaushik , Sai Ranganathan
  This is the basic layout component which contains all the structural formatting for the entire
  app. It imports external libraries such as ant design, bootstrap and moment in order to stye the
  entire structure of the application. It creates and instantiates all the other objects and renders
  it onto this component.
*/

import React, { Component } from 'react';
import { Layout, Menu, Icon, Button, Popconfirm, Popover} from 'antd';
import Scheduler from './Scheduler';
import GroceryList from './GroceryList';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cssHari/App.css'
import moment from 'moment';
const { Sider, Header, Content } = Layout;

export class BasicLayout extends Component {
  constructor(props){
    super(props);
    // the state class for the collapsed referring to the side bar
    this.state = {
      collapsed: false,
      currentDate: moment()
    };
  }

  // sets the state of the collapsed variable to having the attribute of
  // being collapsed down.
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  // sets the current date and logs it out in the console.
  setCurrentDate = date => {
    this.setState({ currentDate: date }, () =>
        console.log(this.state.currentDate)
    );
  }

  // clears the local stoarage and then reloads it when the cache needs to be emptied.
  emptyCache = () => {
    window.localStorage.clear();
    window.location.reload();
  }

  // function renders and returns the layout of the app while instantiating
  // items within the structure.
  render() {
    return (
      <Layout className="basicLayout">
        <Sider
          defaultCollapsed
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          breakpoint='sm'
          className="sider"
        >
          <div className={this.state.collapsed ? "hidden" : "pageTitle"}>
            <h1 className="title">Main Course</h1>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="calendar" />
              <span>Home</span>
            </Menu.Item>
          </Menu>
          <Popover placement='right' content={<GroceryList />} trigger="click" title="My Grocery List">
            <Button className={this.state.collapsed ? "hidden" : "groceryBtn"} type="primary">
              <Icon type="bars" />
              <span>Grocery List</span>
            </Button>
          </Popover>
          <Popconfirm placement='right' title="Are you sure you want to clear the cache?" onConfirm={this.emptyCache} okText="Yes" cancelText="No">
            <Button className={this.state.collapsed ? "hidden" : "clearAll"} type="primary">Clear schedule</Button>
          </Popconfirm>
        </Sider>
        <Layout className={this.state.collapsed ? "main main-grow" : "main"}>
          <Header className="header">
            <h2 className="currentDay">
              {this.state.currentDate.format("MMMM Do, YYYY")}
            </h2>
          </Header>
          <Content className="mainContent" >
            <Scheduler currentDate={this.state.currentDate} setDate={this.setCurrentDate}/>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
