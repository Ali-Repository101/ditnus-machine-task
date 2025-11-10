import React, { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import RecursiveList from '../components/RecursiveList';
import { Container, Card, CardBody, CardTitle, Input, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import Clock from '../components/Clock';

export default function Dashboard() {
  const [treeData, setTreeData] = useState([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [parentId, setParentId] = useState('');

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      const response = await API.get('/persons/tree');
      setTreeData(response.data);
    } catch (error) {
      toast.error('Failed to load persons');
    }
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!newPersonName.trim()) return toast.warn('Please enter a name!');

    try {
      const response = await API.post('/persons', {
        name: newPersonName,
        parent: parentId || null,
      });
      setNewPersonName('');
      setParentId('');
      await fetchTree();
      toast.success(response.data.msg);
    } catch (error) {
      const message = error.response?.data?.msg || 'Error adding person';
      toast.error(message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    toast.info('Logged out successfully');
    window.location.href = '/login';
  };

  // Flatten tree for dropdown
  const flattenTree = (nodes, level = 0) => {
    let result = [];
    nodes.forEach((node) => {
      result.push({ _id: node._id, name: '-'.repeat(level) + ' ' + node.name });
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, level + 1));
      }
    });
    return result;
  };

  const flatPersons = flattenTree(treeData);

  return (
    <Container className="mt-5">
      <Card className="shadow-sm">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <CardTitle tag="h4">Dashboard</CardTitle>
            <Clock />
          </div>

          <form onSubmit={handleAddPerson} className="d-flex gap-2 mb-3">
            <Input
              placeholder="Add person name"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
            />
            <Input
              type="select"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">-- No Parent (Root) --</option>
              {flatPersons.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </Input>
            <Button color="primary" type="submit">
              Add
            </Button>
            <Button color="secondary" type="button" onClick={handleLogout}>
              Logout
            </Button>
          </form>

          <RecursiveList data={treeData} />
        </CardBody>
      </Card>
    </Container>
  );
}
