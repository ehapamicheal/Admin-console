  return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-7">
                <div className="p-4 bg-white shadow-lg rounded">
                    <h2 className="text-base md:text-lg text-black-1 font-bold mb-4">
                        Category ({allCategories.length})
                    </h2>

                    <div className="space-y-2">
                        {displayCategories.map((category) => (
                            <div key={category.id} className="group p-2 rounded-lg">
                                <h3 className="font-semibold text-black-4 text-base leading-6">{capitalizeFirstLetter(category.name)}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 pb-4 px-4 bg-white w-full shadow-lg rounded">
                    <h2 className="text-base md:text-lg text-black-1 font-bold mb-4">Top Products</h2>
                    <div className="space-y-4">
                        {topProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between group gap-3 rounded-lg">
                                <div className="flex items-center gap-x-4">
                                    <div className="bg-gray-bg rounded-lg w-10 h-10 overflow-hidden p-1">
                                    <img
                                        className="w-full h-full object-cover transition-all ease-in-out duration-300 group-hover:scale-110"
                                        src={product.images?.[0] || "https://placehold.co/100x100?text=No+Image"}
                                        alt={product.title}
                                    />
                                    </div>
                                    <div>
                                    <p className="font-semibold text-black-4 text-[15px] sm:text-base leading-6">
                                        {product.title}
                                    </p>
                                    </div>
                                </div>
                            <h3 className="text-red-2 text-sm font-semibold leading-5">₦{product.price}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white pt-4 rounded-lg shadow-md w-full">
                <div className="flex justify-between px-4 mb-4 items-center">
                <h2 className="text-[16px] text-black-1 md:text-lg font-bold">Orders</h2>
                <div className="bg-gray-bg rounded p-1">
                    <select className="outline-none text-sm text-black-3 font-normal leading-2 pl-1"
                    value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Last 30 Days</option>
                        <option value="Daily">Daily</option>
                    </select>
                </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-2 bg-gray-100 ">
                                <th className="text-left pl-4 table_th product_th  whitespace-nowrap">No</th>
                                <th className="table_th product_th text-center whitespace-nowrap">Product</th>
                                <th className="table_th product_th text-center whitespace-nowrap">Amount</th>
                                <th className="table_th text-center product_th whitespace-nowrap">Location</th>
                                <th className="table_th text-center product_th whitespace-nowrap">Date</th>
                                <th className="table_th text-center product_th whitespace-nowrap">Payment Type</th>
                                <th className="table_th text-center product_th whitespace-nowrap">Status</th>
                                <th className="table_th text-center product_th whitespace-nowrap">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentOrders.map((order, index) => (
                                <tr key={order.id} className="border-b border-gray-2">
                                <td className="pl-4 py-2 whitespace-nowrap tbody_tr_td">{indexOfFirstOrder + index + 1}</td>
                                <td className="py-2 responsive-td3">
                                    <div className="flex items-center justify-items-start gap-2">
                                        <div className="group overflow-hidden bg-gray-6 rounded-lg w-9 h-9 p-1">
                                            <img
                                            src={order.orderByProductId?.imageUrl || "https://via.placeholder.com/50"}
                                            alt={order.orderByProductId?.productName || "No name"}
                                            className="object-cover transition-all ease-in-out duration-300 group-hover:scale-110 w-full h-full"
                                            />
                                        </div>
                                        <p className="text-grey-1 product_tr_td">{order.orderByProductId?.productName || "No product"}</p>
                                    </div>
                                </td>

                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td2">₦{order.amount}</td>

                                <td className="py-2 text-center whitespace-nowrap relative group">
                                    <div className="max-w-[120px] mx-auto">
                                    <p className="truncate tbody_tr_td">{order.deliveryAddress}</p>
                                    <div className="absolute z-30 hidden group-hover:flex bg-white shadow-2xl p-2 rounded-lg bottom-full left-1/2 transform -translate-x-1/2 w-60 break-words">
                                        <p className="whitespace-normal break-words text-black text-xs text-center">{order.deliveryAddress}</p>
                                    </div>
                                    </div>
                                </td>

                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td2">{formatDate(order.createdAt)}</td>
                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td">{order.paymentMethod}</td>
                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td2">
                                    <span
                                        className={`
                                            ${order.status === 'payment_success' ? 'text-green-2' : ''}
                                            ${order.status === 'payment_initialize' ? 'text-blue-500' : ''}
                                            ${order.status === 'payment_failed' ? 'text-red-2' : ''}
                                            ${order.status === 'shipped' ? 'text-yellow-400' : ''}
                                            ${order.status === 'delivered' ? 'text-green-2' : ''}
                                        `}
                                        >
                                    {order.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="py-2 text-center whitespace-nowrap responsive-td1">
                                    <div className="flex gap-x-2 items-center justify-center">
                                       <BiSolidShow 
                                         onClick={() => handleViewOrder(order.id)} 
                                         className="text-green-2 cursor-pointer hover:text-green-600 text-xl" 
                                       />
                                    </div>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center py-4 px-2 md:p-4">
                    <span className="text-[14px] text-gray-1 font-normal leading-5">Page {currentPage} of {totalPages}</span>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`border rounded-3xl py-1 flex items-center justify-center border-red-1 px-2 w-7 h-7 md:w-9 md:h-9 transition delay-100 group
                                ${currentPage === 1 ? 'opacity-50' : 'cursor-pointer hover:bg-red-1'}`
                            }
                            >
                            <IoIosArrowBack className={`text-red-1 ${currentPage !== 1 ? 'group-hover:text-white' : ''}`} />
                        </button>

                       {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                            return (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            );
                        })
                        .map((page, index, arr) => (
                            <React.Fragment key={page}>
                                {index > 0 && page - arr[index - 1] > 1 && (
                                    <button className="border text-center border-red-1 rounded w-7 h-7 md:w-9 md:h-9">
                                        <span className="text-black text-center">...</span>
                                    </button>
                                )}
                                <button onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 text-black font-normal text-[12px] md:text-sm flex items-center justify-center rounded-3xl w-7 h-7 md:w-9 md:h-9 cursor-pointer ${
                                    page === currentPage
                                      ? "bg-dash-grey-2 border border-red-1"
                                      : "hover:bg-gray-200"
                                  }`}
                                >
                                {page}
                                </button>
                            </React.Fragment>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`border rounded-3xl flex items-center justify-center py-1 border-red-1 px-2 w-7 h-7 md:w-9 md:h-9 transition delay-100 group 
                            ${currentPage === totalPages ? 'opacity-50' : 'cursor-pointer hover:bg-red-1'}`}
                        >
                            <IoIosArrowForward className={`text-red-1 ${currentPage !== totalPages ? 'group-hover:text-white' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {isLoading && (
                <Spinner />
            )}

            {showOrderModal && !isLoading && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setShowOrderModal(false)}
                />
            )}
        </>
    );


 <PaginationButton
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />    