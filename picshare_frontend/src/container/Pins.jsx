import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar, Feed, PinDetail, CreatePin, Search} from '../components';

const Pins = ({user}) => {
  const [search, setSearch] = useState('');

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar search={search} setSearch={setSearch} user={user} />
      </div>

      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route path="/pin-detail/:pinId" element={<PinDetail user={user && user} />} />
          <Route path="/create-pin" element={<CreatePin user={user && user} />} />
          <Route path="/search" element={<Search search={search} setSearch={setSearch} />} />
        </Routes>
      </div>
    </div>
  );
}

export default Pins