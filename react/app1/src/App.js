import logo from './logo.svg';
import './App.css';
import { useMemo, useState } from 'react';
import { Avatar, Button, Tab, TabNavigation, Table, TextInput } from 'evergreen-ui';

function App() {
  const [username, setUsername] = useState('')

  const [profile, setProfile] = useState({})

  const [followers, setFollowers] = useState([])
  const [repo, setRepo] = useState([])

  const [loading, setLoading] = useState(false)

  const tabs = useMemo(() => ['Followers', 'Repositories'], [])
  // State is only used here for demo purposes, your routing abstraction might support hash links
  const [selectedIndex, setSelectedIndex] = useState(0)

  const searchProfile = async () => {
    // 1. call the api to get profile
    // 2. save the profile in a state var
    setLoading(true)
    try {
      const res = await fetch("https://api.github.com/search/users?q=" + username)

      const data = await res?.json()
      console.log(data)

      setProfile(data?.items[0])
      getFollowers(data?.items[0])
      getRepo(data?.items[0])
    } catch(e) {
      console.error(e);
    }
    finally {
      setLoading(false)
    }
  }

  const getFollowers = async (profile) => {

    try {
      const res = await fetch(profile?.followers_url)
  
      const data = await res?.json()
  
      console.log('38', data)
      setFollowers(data)
    } catch(e) {
      console.error(e);
    }

  }

  const getRepo = async (profile) => {
    try {
      const res = await fetch(profile?.repos_url)
  
      const data = await res?.json()
  
      console.log('56', data)
      setRepo(data)
      
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <div className="App">
      <h1>Search Github Profile</h1>

      <TextInput onChange={(e) => setUsername(e.target.value)} value={username} />

       <Button marginRight={16} appearance="primary" onClick={searchProfile} isLoading={loading} disabled={loading}>
        Search
      </Button>

      {profile?.login && (
        <div style={{marginTop: 30}}>
          <Avatar
            src={profile?.avatar_url}
            name={profile?.login}
            size={40}
          />
          <h3>{profile?.login}</h3>
          {/* {JSON.stringify(profile)} */}

          <TabNavigation>
            {tabs.map((tab, index) => {
              const id = tab.toLowerCase().replace(' ', '-')
              const hash = `#${id}`
              return (
                <Tab
                  href={hash}
                  is="a"
                  isSelected={selectedIndex === index}
                  key={tab}
                  onSelect={() => setSelectedIndex(index)}
                >
                  {tab}
                </Tab>
                
              )
            })}
          </TabNavigation>

          {selectedIndex === 0 && (
            <div>
              <h2>Followers</h2>

              <Table width={800} style={{margin: '0 auto'}}>
                <Table.Head>
                  <Table.TextHeaderCell>Avatar</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Username</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Visit</Table.TextHeaderCell>
                </Table.Head>
                <Table.Body height={'auto'}>
                  {followers?.map((p) => (
                    <Table.Row key={p.id}>
                      <Table.TextCell>
                        <Avatar
                          src={p?.avatar_url}
                          name={p?.login}
                          size={40}
                          /></Table.TextCell>
                          <Table.TextCell>{p.login}</Table.TextCell>
                        <Table.TextCell><a href={"https://github.com/" + p?.login}>Visit Profile</a></Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}

          {selectedIndex === 1 && (
            <div>
              <h2>Repositories</h2>

              <Table width={800} style={{margin: '0 auto'}}>
                <Table.Head>
                  <Table.TextHeaderCell>Avatar</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Username</Table.TextHeaderCell>
                  <Table.TextHeaderCell>View</Table.TextHeaderCell>
                </Table.Head>
                <Table.Body height={'auto'}>
                  {repo?.map((p) => (
                    <Table.Row key={p.id}>
                          <Table.TextCell>{p?.name}</Table.TextCell>
                          <Table.TextCell>{p?.description?.length ? p?.description : 'N/A' }</Table.TextCell>
                        <Table.TextCell><a href={p?.html_url}>View Repo</a></Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      )}

      
    </div>
  );
}

export default App;