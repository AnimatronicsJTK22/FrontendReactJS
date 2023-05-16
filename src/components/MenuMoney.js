import React, { Component } from "react";
import MoneyDataService from "../services/money.service";
import { withRouter } from "../common/with-router";
import { MdCheck } from "react-icons/md";
import Swal from "sweetalert2"

class Money extends Component {
  constructor(props) {
    super(props);
    this.onChangeBalance = this.onChangeBalance.bind(this);
    this.onChangeLastChangeDesc = this.onChangeLastChangeDesc.bind(this);
    this.getMoney = this.getMoney.bind(this);
    this.updateMoney = this.updateMoney.bind(this);
    this.deleteMoney = this.deleteMoney.bind(this);

    this.state = {
      currentMoney: {
        id: null,
        balance: "",
        lastChangeDesc: [],
        balanceDesc: [],
        time: []
      },
      deposit: 0,
      withdraw: 0,
      historyDesc: "",
      balanceChange: "",
      message: "",
    };
  }

  componentDidMount() {
    this.getMoney(this.props.router.params.id);
  }

  onChangeBalance(e) {
    const balance = e.target.value;

    this.setState(function (prevState) {
      return {
        currentMoney: {
          ...prevState.currentMoney,
          balance: balance,
        },
      };
    });
  }

  onChangeLastChangeDesc(e) {
    const lastChangeDesc = e.target.value.split("\n");
    this.setState((prevState) => ({
      currentMoney: {
        ...prevState.currentMoney,
        lastChangeDesc: lastChangeDesc,
      },
    }));
  }  
  
  onChangeDeposit(e) {
    const deposit = e.target.value;
    this.setState({ deposit });
  }
  
  onChangeWithdraw(e) {
    const withdraw = e.target.value;
    this.setState({ withdraw });
  }

  onChangeHistoryDesc(e){
    const historyDesc = e.target.value;
    this.setState({ historyDesc })
  }

  onChangeBalanceChange(e){
    const balanceChange = e.target.value;
    this.setState({ balanceChange });
  }
  
  getMoney(id) {
    MoneyDataService.get(id)
      .then((response) => {
        this.setState({
          currentMoney: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }  

  updateMoney() {
    // Check if historyDesc is empty or ""
    if (!this.state.historyDesc) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Message is required',
      });
      return;
    }

    const formatCurrency = (value) => {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
  
      return formatter.format(value);
    };
    
    const newBalance =
      parseInt(this.state.currentMoney.balance) +
      parseInt(this.state.deposit) -
      parseInt(this.state.withdraw);
    
    // Validation check
    if (parseInt(this.state.withdraw) > parseInt(this.state.currentMoney.balance)) {
      this.setState({
        message: "Withdrawal amount cannot be greater than the current balance",
        withdraw: 0,
      });
      return;
    }

    let balanceChange = "";
    if (this.state.deposit !== 0) {
      balanceChange = "+" + formatCurrency(this.state.deposit);
    } else if (this.state.withdraw !== 0) {
      balanceChange = "-" + formatCurrency(this.state.withdraw);
    }
  
    const newMoney = {
      id: this.state.currentMoney.id,
      balance: newBalance,
      historyDesc: this.state.historyDesc,
      balanceChange: balanceChange
    };
  
    MoneyDataService.update(newMoney.id, newMoney)
    .then((response) => {
      console.log(response.data);
      const updatedMoney = response.data;
      const updatedHistoryDesc = updatedMoney.lastChangeDesc;
      const updatedBalanceChange = updatedMoney.balanceDesc;
      const updatedTime = updatedMoney.time;
      // Only update the necessary properties in the currentMoney object
      this.setState((prevState) => ({
        currentMoney: {
          ...prevState.currentMoney,
          balance: newMoney.balance,
          lastChangeDesc: updatedHistoryDesc,
          balanceDesc: updatedBalanceChange,
          time: updatedTime,
        },
        message: "The money management was updated successfully!",
        deposit: 0,
        withdraw: 0,
        historyDesc: "",
        balanceChange: "",
      }));
    })
    .catch((e) => {
      console.log(e);
    });
  }
  

  deleteMoney() {
    if (window.confirm("Are you sure to delete this Money Management?")) {
      MoneyDataService.delete(this.state.currentMoney.id)
        .then((response) => {
          console.log(response.data);
          // this.props.router.navigate("/");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  render() {
    const { currentMoney } = this.state;

    const formatCurrency = (value) => {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
  
      return formatter.format(value);
    };

    return (
      <div>
        {currentMoney ? (
          <div className="edit-form">
            <h4>Money Discipline</h4>
            <form>
              <div className="form-group">
                <label htmlFor="balance">Balance</label>
                <input
                  type="text"
                  className="form-control"
                  id="balance"
                  value={formatCurrency(currentMoney.balance)}
                  onChange={this.onChangeBalance}
                  disabled
                />
              </div>
              {this.state.deposit === 0 && this.state.withdraw === 0 && (
              <div className="form-group">
                {/* <label>Action</label> */}
                <div className="btn-group">
                  <button
                    className="btn btn-primary"
                    onClick={() => this.setState({ deposit: 1, withdraw: 0 })}
                  >
                    Deposit
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => this.setState({ deposit: 0, withdraw: 1 })}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            )}

            {this.state.deposit !== 0 && (
              <div className="form-group">
                <label htmlFor="deposit">Deposit</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="deposit"
                    value={this.state.deposit}
                    onChange={this.onChangeDeposit.bind(this)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => this.setState({ deposit: 0 })}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => this.setState({ deposit: 0 })}
                  style={{ marginTop: "10px" }}
                >
                  Back
                </button>
              </div>
            )}

            {this.state.withdraw !== 0 && (
              <div className="form-group">
                <label htmlFor="withdraw">Withdraw</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="withdraw"
                    value={this.state.withdraw}
                    onChange={this.onChangeWithdraw.bind(this)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => this.setState({ withdraw: 0 })}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => this.setState({ withdraw: 0 })}
                  style={{ marginTop: "10px" }}
                >
                  Back
                </button>
              </div>
            )}

              <div className="form-group">
                <label htmlFor="historyDesc">Message</label>
                <input
                  type="text"
                  className="form-control"
                  id="historyDesc"
                  value={this.state.historyDesc}
                  onChange={this.onChangeHistoryDesc.bind(this)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">History</label>
                <table className="table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Description</th>
                      <th>Change</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMoney.lastChangeDesc.map((desc, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{desc}</td>
                        <td>{currentMoney.balanceDesc[index]}</td>
                        <td>
                          {new Date(currentMoney.time[index]).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </form>

            <button onClick={this.updateMoney} className="btn btn-success mr-2 btn-icon">
              <MdCheck className="icon"/> 
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Money List...</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Money);