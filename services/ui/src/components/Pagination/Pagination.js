import React, { Fragment, useState, useEffect } from 'react';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';


const Pagination = ({ totalRecords = null, pageLimit = 1, pageNeighbours = 0, onPageChanged = f => f }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalRecords / pageLimit);

    useEffect(() => {
        gotoPage(1);
    }, []);

    useEffect(() => {
        const paginationData = {
            currentPage,
            totalPages: totalPages,
            pageLimit: pageLimit,
            totalRecords: totalRecords
        };
        onPageChanged(paginationData)
    }, [currentPage]);

    const range = (from, to, step = 1) => {
        let i = from;
        const range = [];

        while (i <= to) {
            range.push(i);
            i += step;
        }

        return range;
    }

    const gotoPage = page => {
        const currentPage = Math.max(0, Math.min(page, totalPages));
        setCurrentPage(currentPage);
    }

    const handleClick = (evt, page) => {
        evt.preventDefault();
        gotoPage(page);
    }

    const handleMoveLeft = evt => {
        evt.preventDefault();
        gotoPage(currentPage - (pageNeighbours * 2) - 1);
    }

    const handleMoveRight = evt => {
        evt.preventDefault();
        gotoPage(currentPage + (pageNeighbours * 2) + 1);
    }

    const fetchPageNumbers = () => {
        const totalNumbers = (pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {

            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

            let pages = range(startPage, endPage);

            /**
             * hasLeftSpill: has hidden pages to the left
             * hasRightSpill: has hidden pages to the right
             * spillOffset: number of hidden pages either to the left or to the right
             */
            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
                // handle: (1) < {5 6} [7] {8 9} (10)
                case (hasLeftSpill && !hasRightSpill): {
                    const extraPages = range(startPage - spillOffset, startPage - 1);
                    pages = [LEFT_PAGE, ...extraPages, ...pages];
                    break;
                }

                // handle: (1) {2 3} [4] {5 6} > (10)
                case (!hasLeftSpill && hasRightSpill): {
                    const extraPages = range(endPage + 1, endPage + spillOffset);
                    pages = [...pages, ...extraPages, RIGHT_PAGE];
                    break;
                }

                // handle: (1) < {4 5} [6] {7 8} > (10)
                case (hasLeftSpill && hasRightSpill):
                default: {
                    pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                    break;
                }
            }

            return [1, ...pages, totalPages];

        }

        return range(1, totalPages);

    }

    if (!totalRecords || totalPages === 1) return null;
    const pages = fetchPageNumbers();
    return (
        <Fragment>
            <nav aria-label="Conversation Pagination">
                <ul className="pagination">
                    {pages.map((page, index) => {

                        if (page === LEFT_PAGE) return (
                            <li key={index} className="page-item">
                                <a className="page-link" href="#" aria-label="Previous" onClick={(e) => handleMoveLeft(e)}>
                                    <span aria-hidden="true">&laquo;</span>
                                    <span className="sr-only">Previous</span>
                                </a>
                            </li>
                        );

                        if (page === RIGHT_PAGE) return (
                            <li key={index} className="page-item">
                                <a className="page-link" href="#" aria-label="Next" onClick={(e) => handleMoveRight(e)}>
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </li>
                        );
                        return (
                            <li key={index} className={`page-item${currentPage === page ? ' active' : ''}`}>
                                <a className="page-link" href="#" onClick={(e) => handleClick(e, page)}>{page}</a>
                            </li>
                        );

                    })}

                </ul>
            </nav>
        </Fragment>
    );


}

export default Pagination;