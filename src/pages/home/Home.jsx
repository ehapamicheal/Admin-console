import React from 'react'
import SalesCard from '../../components/ui/SalesCard';
import {AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FaArrowTrendUp } from "react-icons/fa6";
import archieveIcon from "../../assets/svgs/archive-svg.svg"
import Revenue from '../../components/Revenue';
import Orders from '../../components/Orders';

const Home = () => {

  const revenue = [
    { name: "Jan", value: 100 },
    { name: "Feb", value: 1000 },
    { name: "Mar", value: 25000},
    { name: "Apr", value: 100},
    { name: "May", value: 8000},
    { name: "Jun", value: 49000 },
    { name: "Jul", value: 1000 }, 
    { name: "Jul", value: 42000 }, 
    { name: "Jul", value: 4000 }, 
    { name: "Jul", value: 30000 }, 
    { name: "Jul", value: 30000 }, 
    { name: "Jul", value: 30000 }, 
  ];

  

  return (
    <div className="mx-2 md:mx-4 mt-10 pt-14 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        <SalesCard className="p-4">
          <div className="flex gap-2">
            <div className="bg-green-1 hexagon">
              <img src={archieveIcon} alt="sales" />
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-normal text-gray-1 font-dm-sans">Total Sales</p>
              <p className="text-[22px] font-bold text-black-1">34,945</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 justify-end mt-3">
            <FaArrowTrendUp className="text-green-500" />
            <p className="font-dm-sans font-bold text-xs text-gray-4">1.56%</p>
          </div>

          <div className="mt-3">
            <ResponsiveContainer width="100%" height={50}>
              <AreaChart data={revenue}>
                <CartesianGrid strokeDasharray="0" horizontal={false} vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis tickLine={false} axisLine={false} hide />
                <Tooltip />

                <defs>
                  <linearGradient id="colorFill1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <Area 
                  type="basis" 
                  dataKey="value" 
                  name="Sales"
                  stroke="#22C55E" 
                  fill="url(#colorFill1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SalesCard>

        <SalesCard className="p-4">
          <div className="flex gap-2">
            <div className="bg-red-2 hexagon">
              <img src={archieveIcon} alt="Revenue" />
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-normal text-gray-1 font-dm-sans">Total Revenue</p>
              <p className="text-[22px] font-bold text-black-1">N37,000</p>
            </div>
          </div>

          <div className="flex items-center gap-1 justify-end mt-3">
            <FaArrowTrendUp className="text-green-500" />
            <p className="font-dm-sans font-bold text-xs text-gray-4">1.56%</p>
          </div>

          <div className="mt-3">
            <ResponsiveContainer width="100%" height={50}>
              <AreaChart data={revenue}>
                <CartesianGrid strokeDasharray="0" horizontal={false} vertical={false} stroke="#F2F4F" />
                <XAxis dataKey="name" hide />
                <YAxis tickLine={false} axisLine={false} hide />
                <Tooltip />

                <defs>
                  <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5200" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#FF5200" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <Area 
                  type="basis" 
                  dataKey="value" 
                  name="Revenue"
                  stroke="#FF0000" 
                  fill="url(#colorFill)"
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
        </div>
        </SalesCard>

        <SalesCard className="p-4">
          <div className="flex gap-2">
            <div className="hexagon bg-gray-3">
              <img src={archieveIcon} alt="Orders" />
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-normal text-gray-1 font-dm-sans">Total Orders</p>
              <p className="text-[22px] font-bold text-black-1">N17,800</p>
            </div>
          </div>

          <div className="flex items-center gap-1 justify-end mt-3">
            <FaArrowTrendUp className="text-green-500" />
            <p className="font-dm-sans font-bold text-xs text-gray-4">1.56%</p>
          </div>

          <div className="mt-3">
            <ResponsiveContainer width="100%" height={50}>
              <AreaChart data={revenue}>
                <CartesianGrid strokeDasharray="0" horizontal={false} vertical={false} stroke="#B6B6B6" />
                <XAxis dataKey="name" hide />
                <YAxis tickLine={false} axisLine={false} hide />
                <Tooltip />

                <defs>
                  <linearGradient id="colorFill3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B6B6B6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#B6B6B6" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <Area 
                  type="basis" 
                  dataKey="value" 
                  name="Orders"
                  stroke="#B6B6B6" 
                  fill="url(#colorFill3)"
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SalesCard>

        <SalesCard className="bg-blue-100 p-4"> 
          <div className="flex gap-2">
            <div className="hexagon bg-blue-1">
              <img src={archieveIcon} alt="Orders" />
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-normal text-gray-1 font-dm-sans">Total Deliveries</p>
              <p className="text-[22px] font-bold text-black-1">N47,800</p>
            </div>
          </div>

          <div className="flex items-center gap-1 justify-end mt-3">
            <FaArrowTrendUp className="text-green-500" />
            <p className="font-dm-sans font-bold text-xs text-gray-4">1.56%</p>
          </div>

          <div className="mt-3">
            <ResponsiveContainer width="100%" height={50}>
              <AreaChart data={revenue}>
                <CartesianGrid strokeDasharray="0" horizontal={false} vertical={false} stroke="B6B6B6" />
                <XAxis dataKey="name" hide />
                <YAxis tickLine={false} axisLine={false} hide />
                <Tooltip />

                <defs>
                  <linearGradient id="colorFill4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#007AFF" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#007AFF" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <Area 
                  type="basis" 
                  dataKey="value" 
                  name="Deliveries"
                  stroke="#007AFF" 
                  fill="url(#colorFill4)"
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SalesCard>

      </div>

      <Revenue />
      <Orders />
    </div>
  )
}

export default Home;