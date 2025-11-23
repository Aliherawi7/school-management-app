import { t } from 'i18next';
import React, { useEffect, useState } from 'react';

import { ConsumptionsType, EmployeePaymentType, VisitorContractType } from '../../../constants/Others';
import {
    CustomerFactor,
    CustomerPayment,
    DepotEvent,
    Employee,
    EmployeePayment,
    ExchangeReceipt,
    MoneyExchange,
    Product,
} from '../../../Types/Types';
import {
    getAllConsumptions,
    getAllExchangeReceipts,
    getAllMoneyExchanges,
    getAllPayments,
    getDepotEvents,
    getEmployees,
    getEmployeesPayments,
    getFactors,
    getProductPurchases,
    getProducts,
} from '../../../Utils/FirebaseTools';
import { calculateEmployeeMonthlySalaries } from '../../../Utils/ServiceFunctions';
import { Consumption } from '../../Consumptions/AddConsumptions/AddConsumptions';
import { PurchaseFactor } from '../../PurchaseProducts/AddPurchaseProducts/AddPurchaseProducts';
import Button from '../../UI/Button/Button';
import ShotLoadingTemplate from '../../UI/LoadingTemplate/ShotLoadingTemplate';
import MoneyStatus from '../../UI/MoneyStatus/MoneyStatus';


const compayFeeNames = {
    PeopleMoneyFromCompany: "PeopleMoneyFromCompany",
    CompanyMoneyFromPeople: "CompanyMoneyFromPeople",
    Withdraw: "Withdraw",
    AvailableProducts: "totalOfAvailableProductMoneyInDepotAndShop",
}
const companyFee = new Map();
const GeneralReports: React.FC = () => {
    const [purchases, setpurchases] = useState<PurchaseFactor[]>([]);
    const [sales, setsales] = useState<CustomerFactor[]>([]);
    const [consumptions, setconsumptions] = useState<Consumption[]>([]);
    const [employeePayments, setEmployeePayments] = useState<EmployeePayment[]>([]);
    const [customerPayments, setcustomerPayments] = useState<CustomerPayment[]>([]);
    const [totalCustomerPayments, setTotalCustomerPayments] = useState(0);
    const [employees, setemployees] = useState<Employee[]>([]);
    const [exchanges, setexchanges] = useState<MoneyExchange[]>([]);
    const [exchangesReceipts, setexchangesReceipts] = useState<ExchangeReceipt[]>([])
    const [products, setproducts] = useState<Product[]>([])
    const [totalSales, settotalSales] = useState({
        totalMoney: 0,
        totalProducts: 0,
        totalShareOfVisitor: 0,
    })

    const [totalPurchases, settotalPurchases] = useState({
        totalMoney: 0,
        totalProducts: 0,
        totalPackages: 0,
    });

    const [totalConsumptions, settotalConsumptions] = useState({
        constants: 0,
        major: 0,
        widthraw: 0,
        ads: 0,
        retrail: 0,
        returnable: 0,
        discounts: 0,
        totalAll: 0
    })

    const [totalEmployeeSalaries, setTotalEmployeeSalaries] = useState(0)

    const [totalEmployeePayment, setTotalEmployeePayment] = useState({
        totalPaidSalaries: 0,
        totalPaidVisitorAmount: 0,
    })

    const [dollarRate, setDollarRate] = useState<number>(0)
    const [availableMoneyInShop, setAvailableMoneyInShop] = useState<number>(0);

    const [interest, setinterest] = useState({
        ready: false,
        peopleMoneyFromCompany: 0,
        companyMoneyFromPeople: 0,
        withdraw: 0,
        returnable: 0,
        availableProducts: 0,
        totalCustomerPaid: 0,
        totalConsumptions: 0,
        interestResult: 0
    });

    const [depotEvents, setdepotEvents] = useState<DepotEvent[]>([]);


    const [loading, setLoading] = useState(true); // Loading state
    const [fetchCount, setFetchCount] = useState(0); // Counter for fetches

    const incrementFetchCount = () => setFetchCount((prev) => prev + 1);
    const decrementFetchCount = () => setFetchCount((prev) => {
        const newCount = prev - 1;
        if (newCount === 0) setLoading(false); // Stop loading when all fetches are done
        return newCount;
    });

    useEffect(() => {
        setLoading(true); // Start loading
        const fetchOperations = [
            () => getFactors().then(res => {
                const totalMoney = res.reduce((a, b) => a + Number(b.totalAll), 0);
                const totalProducts = res.reduce((a, b) => a + b.productsInFactor.reduce((c, d) => c + Number(d.total), 0), 0);
                const totalShareOfVisitor = res.reduce((a, b) => a + (b.visitorAccount?.visitorAmount ?? 0), 0);
                settotalSales({ totalMoney, totalProducts, totalShareOfVisitor });
                setsales(res);
            }),
            () => getProductPurchases().then(res => {
                const totalMoney = res.reduce((a, b) => a + Number(b.totalAmount), 0);
                const totalPackages = res.reduce((a, b) => a + Number(b.totalPackage), 0);
                const totalProducts = res.reduce((a, b) => a + Number(b.totalProducts), 0);
                settotalPurchases({ totalMoney, totalPackages, totalProducts });
                setpurchases(res);
            }),
            () => getDepotEvents().then(res => {
                setdepotEvents(res)
            }),
            () => getAllConsumptions().then(res => {
                settotalConsumptions({
                    ads: res.filter(item => item.type === ConsumptionsType.ADVERTISEMENTS_CONSUMPTIONS).reduce((a, b) => a + Number(b.amount), 0),
                    constants: res.filter(item => item.type === ConsumptionsType.CONSTANT_CONSUMPTION).reduce((a, b) => a + Number(b.amount), 0),
                    major: res.filter(item => item.type === ConsumptionsType.MAJOR_CONSUMPTION).reduce((a, b) => a + Number(b.amount), 0),
                    retrail: res.filter(item => item.type === ConsumptionsType.RETAIL_CONSUMPTION).reduce((a, b) => a + Number(b.amount), 0),
                    widthraw: res.filter(item => item.type === ConsumptionsType.WITHDRAW).reduce((a, b) => a + Number(b.amount), 0),
                    returnable: res.filter(item => item.type === ConsumptionsType.RETURNABLE).reduce((a, b) => a + Number(b.amount), 0),
                    discounts: res.filter(item => item.type === ConsumptionsType.DISCOUNTS).reduce((a, b) => a + Number(b.amount), 0),
                    totalAll: res.reduce((a, b) => a + Number(b.amount), 0),
                });
                setconsumptions(res);
            }),
            () => getAllPayments().then(res => {
                setTotalCustomerPayments(res.reduce((a, b) => a + Number(b.amount), 0));
                setcustomerPayments(res);
            }),
            () => getEmployeesPayments().then(res => {
                setTotalEmployeePayment({
                    totalPaidSalaries: res.filter(item => item.type === EmployeePaymentType.SALARY).reduce((a, b) => a + Number(b.amount), 0),
                    totalPaidVisitorAmount: res.filter(item => item.type === EmployeePaymentType.SALES).reduce((a, b) => a + Number(b.amount), 0),
                });
                setEmployeePayments(res);
            }),
            () => getEmployees().then(res => {
                const total = res.map(em => calculateMonthlySalaries(em)).reduce((a, b) => a + b, 0);
                setTotalEmployeeSalaries(total);
                setemployees(res);
            }),
            () => getAllExchangeReceipts().then(res => setexchangesReceipts(res)),
            () => getAllMoneyExchanges().then(res => setexchanges(res)),
            () => getProducts().then(res => {
                setproducts(res);
            })
        ];

        fetchOperations.forEach(fetchOperation => {
            incrementFetchCount(); // Increment fetch count before starting the operation
            fetchOperation().finally(decrementFetchCount); // Decrement fetch count after the operation completes
        });

    }, []);


    // useEffect(() => {
    //     getFactors()
    //         .then(res => {
    //             const totalMoney = res.reduce((a, b) => a + Number(b.totalAll), 0);
    //             const totalProducts = res.reduce((a, b) => a + b.productsInFactor.reduce((c, d) => c + Number(d.total), 0), 0);
    //             const totalShareOfVisitor = res.reduce((a, b) => a + (b.visitorAccount?.visitorAmount ?? 0), 0);
    //             // const totalCustomerPayments = res.reduce((a, b) => a + (b.visitorAccount?.visitorAmount ?? 0), 0);
    //             settotalSales({
    //                 totalMoney: totalMoney,
    //                 totalProducts: totalProducts,
    //                 totalShareOfVisitor: totalShareOfVisitor,
    //             })
    //             setsales(res)
    //         })
    //     getProductPurchases()
    //         .then(res => {
    //             const totalMoney = res.reduce((a, b) => a + Number(b.totalAmount), 0);
    //             const totalPackages = res.reduce((a, b) => a + Number(b.totalPackage), 0);
    //             const totalProducts = res.reduce((a, b) => a + Number(b.totalProducts), 0);
    //             settotalPurchases({
    //                 totalMoney: totalMoney,
    //                 totalPackages: totalPackages,
    //                 totalProducts: totalProducts
    //             })
    //             setpurchases(res)
    //         })

    //     getAllConsumptions()
    //         .then(res => {
    //             settotalConsumptions({
    //                 ads: res.filter(item => item.type === ConsumptionsType.ADVERTISEMENTS_CONSUMPTIONS).reduce((a, b) => a + Number(b.amount), 0),
    //                 constants: res.filter(item => item.type === ConsumptionsType.CONSTANT_CONSUMPTION).reduce((a, b) => a + Number(b.amount), 0),
    //                 major: res.filter(item => item.type === ConsumptionsType.MAJOR_CONSUMPTION).reduce((a, b) => a + Number(b.amount), 0),
    //                 retrail: res.filter(item => item.type === ConsumptionsType.RETAIL_CONSUMPTION).reduce((a, b) => a + Number(b.amount), 0),
    //                 widthraw: res.filter(item => item.type === ConsumptionsType.WITHDRAW).reduce((a, b) => a + Number(b.amount), 0),
    //                 totalAll: res.reduce((a, b) => a + Number(b.amount), 0)
    //             });
    //             setconsumptions(res)
    //         })

    //     getAllPayments()
    //         .then(res => {
    //             setTotalCustomerPayments(res.reduce((a, b) => a + Number(b.amount), 0))
    //             setcustomerPayments(res)
    //         })

    //     getEmployeesPayments()
    //         .then(res => {
    //             console.log(res);
    //             console.log("calc: ", {
    //                 totalEmployeeSalaries: 0,
    //                 totalPaidSalaries: res.filter(item => item.type === EmployeePaymentType.SALARY).reduce((a, b) => a + Number(b.amount), 0),
    //                 totalPaidVisitorAmount: res.filter(item => item.type === EmployeePaymentType.SALES).reduce((a, b) => a + Number(b.amount), 0),
    //             });

    //             setTotalEmployeePayment({
    //                 totalPaidSalaries: res.filter(item => item.type === EmployeePaymentType.SALARY).reduce((a, b) => a + Number(b.amount), 0),
    //                 totalPaidVisitorAmount: res.filter(item => item.type === EmployeePaymentType.SALES).reduce((a, b) => a + Number(b.amount), 0),
    //             })
    //             setEmployeePayments(res)
    //         });


    //     getEmployees()
    //         .then(res => {
    //             const total = res.map(em => calculateMonthlySalaries(em)).reduce((a, b) => a + b, 0);
    //             setTotalEmployeeSalaries(total)
    //             setemployees(res)
    //         })

    //     getAllExchangeReceipts()
    //         .then(res => {
    //             console.log(res);

    //             setexchangesReceipts(res)
    //         });

    //     getAllMoneyExchanges()
    //         .then(res => setexchanges(res));

    // }, [])

    console.log(exchanges, exchangesReceipts);



    const calculateMonthlySalaries = (employee: Employee) => {
        const { total, } = calculateEmployeeMonthlySalaries(employee);
        return total;
    };


    const calculateWithdrawableAmount = (totalAmountOfAllFactors: number, totalCustomersPaid: number, totalShareOfVisitor: number) => {
        if (totalAmountOfAllFactors === 0) return 0
        return (totalCustomersPaid * totalShareOfVisitor) / totalAmountOfAllFactors;
    }

    const getTotalAmountOfFactors = () => {

        let visitorWithdrawableAmount = 0;

        employees.filter(emp => emp.visitorContractType !== VisitorContractType.NONE)
            .forEach(emp => {
                const factors = sales.filter(fac => fac.visitorAccount?.visitorId === emp.id);

                const totalPaymentsOfThisVisitor = employeePayments
                    .filter(item => item.employeeId === emp.id && item.type === EmployeePaymentType.SALES)
                    .reduce((a, b) => a + Number(b.amount), 0);

                let totalOfAllThisVisitorFactors = 0;
                let totalShareOfVisitor = 0
                if (factors) {
                    factors.forEach(item => {
                        totalOfAllThisVisitorFactors += item.totalAll;
                        totalShareOfVisitor += item.visitorAccount ? item?.visitorAccount?.visitorAmount : 0;

                    })
                }

                let totalCustomersPayments = customerPayments.filter(cp => cp.visitorId === emp.id)
                    .reduce((a, b) => a + Number(b.amount), 0)

                visitorWithdrawableAmount += calculateWithdrawableAmount(totalOfAllThisVisitorFactors, totalCustomersPayments, totalShareOfVisitor) - totalPaymentsOfThisVisitor;
            })



        return visitorWithdrawableAmount;
    }



    const calculateExchangerFees = () => {
        const totalGivenMoney = exchanges.reduce((a, b) => a + Number(b.dollarMoney), 0);
        const totalTakenMoney = exchangesReceipts.reduce((a, b) => a + Number(b.dollarAmount), 0);
        console.log(`given: ${totalGivenMoney} - taken :${totalTakenMoney}`);

        const result = totalGivenMoney - totalTakenMoney;
        if (result > 0) {
            const value = companyFee.get(compayFeeNames.CompanyMoneyFromPeople);
            companyFee.set(compayFeeNames.CompanyMoneyFromPeople, result + Number(value))
        } else {
            const value = companyFee.get(compayFeeNames.PeopleMoneyFromCompany);
            companyFee.set(compayFeeNames.PeopleMoneyFromCompany, result + Number(value))
        }

        return {
            totalGivenMoney: totalGivenMoney,
            totalTakenMoney: totalTakenMoney,
            result: result
        };
    }

    const calculateCompanyFee = () => {
        let peopleMoneyFromCompany = 0;
        // The total amount the company has outstanding with the public from sales section
        let companyMoneyFromPeople = totalSales.totalMoney - totalCustomerPayments;

        let withdraw = totalConsumptions.widthraw;
        let availableProducts = totalAvailableProducts().totalPrice;
        let totalCustomerPaid = totalCustomerPayments;


        // employee withdrawable amount with company
        const remainedSalaries = totalEmployeeSalaries - totalEmployeePayment.totalPaidSalaries;
        if (remainedSalaries > 0) {
            peopleMoneyFromCompany += remainedSalaries;
        } else {
            companyMoneyFromPeople += Math.abs(remainedSalaries)
        }

        if (calculateExchangerFees().result > 0) {
            companyMoneyFromPeople += calculateExchangerFees().result * dollarRate;
        } else {
            peopleMoneyFromCompany += Math.abs(Number(calculateExchangerFees().result)) * dollarRate;
        }


        // visitor withdrawable amount with company
        const visitorRemainedWithdrawableMoney = getTotalAmountOfFactors();
        if (visitorRemainedWithdrawableMoney > 0) {
            peopleMoneyFromCompany += visitorRemainedWithdrawableMoney
        } else {
            companyMoneyFromPeople += Math.abs(visitorRemainedWithdrawableMoney);
        }
        const consumptionsCalc = (totalConsumptions.ads + totalConsumptions.constants + totalConsumptions.major + totalConsumptions.discounts + totalConsumptions.retrail);

        setinterest({
            ready: true,
            peopleMoneyFromCompany: peopleMoneyFromCompany,
            companyMoneyFromPeople: companyMoneyFromPeople,
            withdraw: withdraw,
            returnable: totalConsumptions.returnable,
            availableProducts: availableProducts,
            totalCustomerPaid: totalCustomerPaid,
            totalConsumptions: consumptionsCalc,
            interestResult: (companyMoneyFromPeople + withdraw + totalConsumptions.returnable + availableProducts + availableMoneyInShop) - (peopleMoneyFromCompany)
        })

    }

    const totalAvailableProducts = () => {
        const depotProduct = products.map(item => ({ id: item.id, inventory: 0, price: item.price }));
        const shopProduct = products.map(item => ({ id: item.id, inventory: 0, price: item.price }));

        // calculate total nummber of purchased product
        purchases.forEach(purch => {
            purch.products.forEach(pr => {
                const index = depotProduct.findIndex(temPr => temPr.id === pr.productId);
                depotProduct[index].inventory += Number(pr.totalNumber);
                depotProduct[index].price = Number(pr.finalProductPrice);

            })
        })

        // minus total number of product by depot event
        depotEvents.forEach(de => {
            de.products.forEach(pr => {
                const indexD = depotProduct.findIndex(temPr => temPr.id === pr.product.id);
                let total = Number(pr.totalNumber);
                depotProduct[indexD].inventory -= total;

                const indexS = shopProduct.findIndex(temPr => temPr.id === pr.product.id);
                shopProduct[indexS].inventory += total;
            })
        })


        // minus total number of product by customer-factor
        sales.forEach(factor => {
            factor.productsInFactor.forEach(pr => {
                const index = shopProduct.findIndex(temPr => temPr.id === pr.productId);
                shopProduct[index].inventory -= Number(pr.total);
            })
        });

        return {
            availableProducts: depotProduct.reduce((a, b) => a + b.inventory, 0) + shopProduct.reduce((a, b) => a + b.inventory, 0),
            totalPrice: depotProduct.reduce((a, b) => a + (b.price * b.inventory), 0) + shopProduct.reduce((a, b) => a + (b.price * b.inventory), 0)
        }

    }

    if (loading) {
        return <ShotLoadingTemplate />
    }


    return (
        <div>
            <div className='input'>
                <p>{t('sales')}</p>
                <div className='display_flex justify_content_space_around'>
                    <span>{t('totalSalesAmount')}: {totalSales.totalMoney}</span>
                    <span>{t('totalAllPaidAmount')}: {totalCustomerPayments}</span>
                    <span>{t('totalRemainedAmount')}: {Math.abs(totalSales.totalMoney - totalCustomerPayments)} <MoneyStatus number={totalSales.totalMoney - totalCustomerPayments} /></span>
                    <span>{t('visitorShareOfSales')}: {totalSales.totalShareOfVisitor}</span>
                    <span>{t('totalProducts')}: {totalSales.totalProducts}</span>
                </div>
            </div>

            <div className='input margin_top_10'>
                <p>{t('purchases')}</p>
                <div className='display_flex justify_content_space_around'>
                    <span>{t('theAmountOfMoneyPurchase')}: {totalPurchases.totalMoney.toFixed(0)}</span>
                    <span>{t('total')} {t('package')}: {totalPurchases.totalPackages}</span>
                    <span>{t('totalProducts')}: {totalPurchases.totalProducts}</span>
                </div>
            </div>

            {/* total available product money in depot and shop */}
            <div className='input margin_top_10'>
                <p>{t('totalOfAvailableProductMoneyInDepotAndShop')}</p>
                <div className='display_flex justify_content_space_around'>
                    <div className='display_flex justify_content_space_around'>
                        <span>{t('collection')}: {totalAvailableProducts().totalPrice.toFixed(0)} {t('af')}</span>
                    </div>

                    <div className='display_flex justify_content_space_around'>
                        <span>{t('total')}: {totalAvailableProducts().availableProducts.toFixed(0)}</span>
                    </div>
                </div>
            </div>

            {/* balance of money with money exchanger  */}
            <div className='input margin_top_10'>
                <p>{t('balanceMoneyExchangers')}</p>
                <div className='display_flex justify_content_space_around'>
                    <span>{t('totalGivenDollar')}:
                        {calculateExchangerFees().totalGivenMoney}
                    </span>
                    <span>{t('totalTakenDollar')}:
                        {calculateExchangerFees().totalTakenMoney}
                    </span>
                    <span>{t('remainedAmount')}:
                        {Math.abs(calculateExchangerFees().result)}
                        <MoneyStatus number={calculateExchangerFees().result * -1} />
                    </span>
                </div>
            </div>

            <div className='input margin_top_10'>
                <p>{t('consumptions')}</p>
                <div className='display_flex justify_content_space_around'>
                    <span>{t(ConsumptionsType.CONSTANT_CONSUMPTION)}: {totalConsumptions.constants}</span>
                    <span>{t(ConsumptionsType.MAJOR_CONSUMPTION)}: {totalConsumptions.major}</span>
                    <span>{t(ConsumptionsType.RETAIL_CONSUMPTION)}: {totalConsumptions.retrail}</span>
                    <span>{t(ConsumptionsType.ADVERTISEMENTS_CONSUMPTIONS)}: {totalConsumptions.ads}</span>
                    <span>{t("withdrawals")}: {totalConsumptions.widthraw}</span>
                    <span>{t("DISCOUNTS")}: {totalConsumptions.discounts}</span>
                    <span>{t("RETURNABLE")}: {totalConsumptions.returnable}</span>
                </div>
            </div>
            <div className='input margin_top_10'>
                <p>{t('employees')}</p>
                <div className='display_flex justify_content_space_around'>
                    <span>{t('collection')} {t('salaries')}: {totalEmployeeSalaries}</span>
                    <span>{t('collection')} {t('paidSalaries')}: {totalEmployeePayment.totalPaidSalaries}</span>
                    <span>
                        {t('remainedAmount')}:
                        {Math.abs(totalEmployeeSalaries - totalEmployeePayment.totalPaidSalaries).toFixed(0)}
                        <MoneyStatus number={(totalEmployeeSalaries - totalEmployeePayment.totalPaidSalaries) * (-1)} />
                    </span>
                </div>
            </div>

            {/* balance of visitors  */}
            <div className='input margin_top_10'>
                <p> {t('visitor')}</p>
                <div className='display_flex justify_content_space_around'>
                    <span>{t('visitorShareOfSales')}: {totalSales.totalShareOfVisitor}</span>
                    <span>{t('totalVisitorPaid')}: {totalEmployeePayment.totalPaidVisitorAmount}</span>
                    <span>
                        {t('collection')} {t("withdrawableAmount")}:
                        {Math.abs(getTotalAmountOfFactors()).toFixed(0)}
                        <MoneyStatus number={getTotalAmountOfFactors() * -1} />
                    </span>
                </div>
            </div>


            <div className=' margin_top_20'>
                <div className='display_flex'>
                    <div>
                        <label htmlFor="dollarToAF">{t('dollarToAF')}: </label>
                        <input type="text" className='input' name='dollarToAF' onChange={(e) => setDollarRate(Number(e.target.value))} />
                    </div>
                    <div>
                        <label htmlFor="">{t('availableMoneyInShop')}: </label>
                        <input type="text" className='input' name='availableMoneyInShop' onChange={(e) => setAvailableMoneyInShop(Number(e.target.value))} />
                    </div>

                    <Button text={t("interestCalculation")} onClick={calculateCompanyFee} />
                </div>

                {interest.ready ?
                    <table className='custom_table full_width margin_top_20'>
                        <thead>
                            <tr><th colSpan={3}>{t('tableOfInterestCalculation')}</th></tr>
                            <tr>
                                <th>#</th>
                                <th>{t('name')}</th>
                                <th>{t('amount')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>{t('collection')} {t('companyMoneyFromPeople')}</td>
                                <td>{interest.companyMoneyFromPeople.toFixed(0)}</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                {/* <td>{t('totalAllPaidAmount')}</td> */}
                                <td>{t('availableMoneyInShop')}</td>
                                <td>{availableMoneyInShop.toFixed(0)}</td>
                            </tr>

                            <tr>
                                <td>3</td>
                                <td>{t('totalOfAvailableProductMoneyInDepotAndShop')}</td>
                                <td>{interest.availableProducts.toFixed(0)}</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>{t('withdrawals')}</td>
                                <td>{interest.withdraw.toFixed(0)}</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>{t("collection")} {t('consumptions')} {t('returnable')}</td>
                                <td>{interest.returnable.toFixed(0)}</td>
                            </tr>

                            <tr>
                                <td>6</td>
                                <td>{t('peopleMoneyFromCompany')}</td>
                                <td>{interest.peopleMoneyFromCompany.toFixed(0)}</td>
                            </tr>

                            <tr>
                                <td>{t("totalInterest")}</td>
                                <td colSpan={2}>
                                    {
                                        Math.abs(interest.interestResult).toFixed(0)
                                    }
                                    <MoneyStatus number={interest.interestResult * -1} />
                                    {t('af')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    : ''
                }

            </div>

        </div>
    )

}

export default GeneralReports