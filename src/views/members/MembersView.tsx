import { useQuery } from '@tanstack/react-query';
import { getAllMembers } from '../../services/memberService';
import { useState, useMemo } from 'react';
import type { Member } from '../../services/memberService';
import MembersHeader from '../../components/members/MembersHeader';
import MembersStats from '../../components/members/MembersStats';
import MembersFilters from '../../components/members/MembersFilters';
import MembersTable from '../../components/members/MembersTable';
import EditMemberModal from '../../components/members/EditMemberModal';
import MembersLoadingState from '../../components/members/MembersLoadingState';
import MembersErrorState from '../../components/members/MembersErrorState';

export default function MembersView() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: members, isLoading, error } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers
  });

  // Filtrar miembros
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    
    return members.filter((member: Member) => {
      const matchesSearch = member.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || 
                           (statusFilter === 'active' && member.isActive === true) ||
                           (statusFilter === 'inactive' && member.isActive === false);
      
      return matchesSearch && matchesStatus;
    });
  }, [members, searchTerm, statusFilter]);

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedMember(null);
  };

  if (isLoading) {
    return <MembersLoadingState />;
  }

  if (error) {
    return <MembersErrorState />;
  }

  return (
    <div className="w-full space-y-6">
      <MembersHeader />
      <MembersStats members={members} />
      <MembersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filteredCount={filteredMembers.length}
        totalCount={members?.length || 0}
      />
      <MembersTable
        members={filteredMembers}
        onEditMember={handleEditMember}
      />
      <EditMemberModal
        isOpen={showEditModal}
        onClose={handleCloseModal}
        selectedMember={selectedMember}
      />
    </div>
  );
}
