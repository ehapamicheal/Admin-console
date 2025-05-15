import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const Revenue = () => {
      
    const data = [
        { month: 'Jan', revenue: 4000 },
        { month: 'Feb', revenue: 3000 },
        { month: 'Mar', revenue: 5000 },
        { month: 'Apr', revenue: 4000 },
        { month: 'May', revenue: 4500 },
        { month: 'Jun', revenue: 4800 },
        { month: 'Jul', revenue: 4700 },
        { month: 'Aug', revenue: 5000 },
        { month: 'Sep', revenue: 5200 },
        { month: 'Oct', revenue: 5100 },
        { month: 'Nov', revenue: 5300 },
        { month: 'Dec', revenue: 2000 },
    ];
      

    return (
        <div className="mt-7">
            <div className="py-4 bg-white shadow-lg rounded">
                <div className="flex items-center justify-between px-4 mb-4">
                    <h2 className="text-[16px] text-black-1 md:text-lg font-bold">Revenue</h2>

                    <div className="bg-gray-bg rounded p-1">
                        <select className="outline-none text-sm text-black-3 font-normal leading-2 pl-1" name="" id="">
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Daily">Daily</option>
                        </select>
                    </div>
                </div>

                <div className="ml-2 mr-1">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid  strokeDasharray="0" vertical={false} stroke="#B6B6B6"/>
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#FF4D4D" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Revenue;