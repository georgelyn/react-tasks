import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ICategory } from '../../models';
import './CategoryList.css';

export default function CategoryList(props: {
  categories: ICategory[];
  onClick(param: any): void;
  selectedCategory: string;
}) {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <div className={`sidebar ${toggle ? 'sidebar-toggle' : ''}`}>
        <FontAwesomeIcon
          icon={faBars}
          className={'sidebar-fa-bars'}
          onClick={() => {
            setToggle(!toggle);
          }}
        ></FontAwesomeIcon>
        <ul>
          {props.categories.map((category) => {
            if (category.id) {
              return (
                <li
                  className={
                    category.id === props.selectedCategory
                      ? 'category-selected'
                      : ''
                  }
                  key={category.id}
                  onClick={() => {
                    props.onClick({
                      field: 'categoryId',
                      value: `${category.id}`,
                    });
                  }}
                >
                  {category.name}
                </li>
              );
            }
          })}
        </ul>
      </div>
    </>
  );
}
