import React, { useEffect } from 'react';
import styles from './index.less';
import { Select } from 'antd';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const SearchBar = (props) => {
  const { basicMapStore, dispatch } = props;
  const { basicMap, queryData } = basicMapStore;
  useEffect(() => {}, [basicMap]);

  const handleSearch = (value) => {
    dispatch({
      type: 'basicMapStore/getQueryData',
      payload: {
        keywords: value,
      },
    });
  };

  const handleChange = (value) => {
    const data = value.split(',');
    if (data.length === 2) {
      const address = data[1];
      dispatch({
        type: 'basicMapStore/getLocation',
        payload: {
          address,
        },
      });
    }
    if (data.length === 3) {
      const location = [data[0], data[1]];
      if (basicMap) {
        basicMap.setCenter(location);
        basicMap.setZoom(16);
      }
    }
  };

  const options =
    queryData &&
    queryData.map((item, i) => (
      <Option value={`${item.location},${item.district}`} key={`${item.location}${i + 1}`}>
        {item.name}
        <span style={{ color: '#f5f5f5', fontSize: '12px', marginLeft: '10px' }}>
          {item.district}
        </span>
      </Option>
    ));

  return (
    <Select
      showSearch
      placeholder="搜索"
      filterOption={false}
      notFoundContent={null}
      onSearch={handleSearch}
      onChange={handleChange}
      className={styles.searchBar}
      suffixIcon={() => (
        <SearchOutlined
          style={{
            fontSize: '20px',
            position: 'absolute',
            top: '-4px',
            right: '0px',
            color: '#fff',
          }}
        />
      )}
    >
      {options}
    </Select>
  );
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(SearchBar);
