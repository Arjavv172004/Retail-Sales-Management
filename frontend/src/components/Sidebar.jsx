import { useState } from 'react';
import { Home, Network, Play, Folder, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = () => {
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [invoicesExpanded, setInvoicesExpanded] = useState(true);

  return (
    <div className="w-64 bg-[#4A148C] text-white h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo and User */}
      <div className="p-4 border-b border-purple-700">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-[#4A148C] font-bold text-lg">V</span>
          </div>
          <span className="font-semibold">Vault</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Anurag Yadav</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-3 p-2 hover:bg-purple-800 rounded cursor-pointer">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-3 p-2 hover:bg-purple-800 rounded cursor-pointer">
            <Network className="w-5 h-5" />
            <span>Nexus</span>
          </div>
          
          <div className="flex items-center space-x-3 p-2 hover:bg-purple-800 rounded cursor-pointer">
            <Play className="w-5 h-5" />
            <span>Intake</span>
          </div>
          
          {/* Services */}
          <div>
            <div 
              className="flex items-center justify-between p-2 hover:bg-purple-800 rounded cursor-pointer"
              onClick={() => setServicesExpanded(!servicesExpanded)}
            >
              <div className="flex items-center space-x-3">
                <Folder className="w-5 h-5" />
                <span>Services</span>
              </div>
              {servicesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
            {servicesExpanded && (
              <div className="ml-8 mt-1 space-y-1">
                <div className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded cursor-pointer">
                  <div className="w-4 h-4 border border-white rounded"></div>
                  <span className="text-sm">Pre-active</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded cursor-pointer">
                  <div className="w-4 h-4 border border-white rounded"></div>
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded cursor-pointer">
                  <div className="w-4 h-4 border border-white rounded"></div>
                  <span className="text-sm">Blocked</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded cursor-pointer">
                  <div className="w-4 h-4 border border-white rounded"></div>
                  <span className="text-sm">Closed</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Invoices */}
          <div>
            <div 
              className="flex items-center justify-between p-2 hover:bg-purple-800 rounded cursor-pointer"
              onClick={() => setInvoicesExpanded(!invoicesExpanded)}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5" />
                <span>Invoices</span>
              </div>
              {invoicesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
            {invoicesExpanded && (
              <div className="ml-8 mt-1 space-y-1">
                <div className="flex items-center space-x-2 p-2 bg-purple-800 rounded cursor-pointer">
                  <span className="text-sm">Proforma Invoices</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded cursor-pointer">
                  <span className="text-sm">Final Invoices</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

