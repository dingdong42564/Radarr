import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import IconButton from 'Components/Link/IconButton';
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableSelectCell from 'Components/Table/Cells/TableSelectCell';
import Column from 'Components/Table/Column';
import TableRow from 'Components/Table/TableRow';
import { icons, kinds } from 'Helpers/Props';
import MovieFormats from 'Movie/MovieFormats';
import MovieLanguages from 'Movie/MovieLanguages';
import MovieQuality from 'Movie/MovieQuality';
import MovieTitleLink from 'Movie/MovieTitleLink';
import useMovie from 'Movie/useMovie';
import { removeBlocklistItem } from 'Store/Actions/blocklistActions';
import Blocklist from 'typings/Blocklist';
import { SelectStateInputProps } from 'typings/props';
import translate from 'Utilities/String/translate';
import BlocklistDetailsModal from './BlocklistDetailsModal';
import styles from './BlocklistRow.css';

interface BlocklistRowProps extends Blocklist {
  isSelected: boolean;
  columns: Column[];
  onSelectedChange: (options: SelectStateInputProps) => void;
}

function BlocklistRow(props: BlocklistRowProps) {
  const {
    id,
    movieId,
    sourceTitle,
    languages,
    quality,
    customFormats,
    date,
    protocol,
    indexer,
    message,
    isSelected,
    columns,
    onSelectedChange,
  } = props;

  const movie = useMovie(movieId);
  const dispatch = useDispatch();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleDetailsPress = useCallback(() => {
    setIsDetailsModalOpen(true);
  }, [setIsDetailsModalOpen]);

  const handleDetailsModalClose = useCallback(() => {
    setIsDetailsModalOpen(false);
  }, [setIsDetailsModalOpen]);

  const handleRemovePress = useCallback(() => {
    dispatch(removeBlocklistItem({ id }));
  }, [id, dispatch]);

  if (!movie) {
    return null;
  }

  return (
    <TableRow>
      <TableSelectCell
        id={id}
        isSelected={isSelected}
        onSelectedChange={onSelectedChange}
      />

      {columns.map((column) => {
        const { name, isVisible } = column;

        if (!isVisible) {
          return null;
        }

        if (name === 'movieMetadata.sortTitle') {
          return (
            <TableRowCell key={name}>
              <MovieTitleLink titleSlug={movie.titleSlug} title={movie.title} />
            </TableRowCell>
          );
        }

        if (name === 'sourceTitle') {
          return <TableRowCell key={name}>{sourceTitle}</TableRowCell>;
        }

        if (name === 'languages') {
          return (
            <TableRowCell key={name} className={styles.languages}>
              <MovieLanguages languages={languages} />
            </TableRowCell>
          );
        }

        if (name === 'quality') {
          return (
            <TableRowCell key={name} className={styles.quality}>
              <MovieQuality quality={quality} />
            </TableRowCell>
          );
        }

        if (name === 'customFormats') {
          return (
            <TableRowCell key={name}>
              <MovieFormats formats={customFormats} />
            </TableRowCell>
          );
        }

        if (name === 'date') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore ts(2739)
          return <RelativeDateCell key={name} date={date} />;
        }

        if (name === 'indexer') {
          return (
            <TableRowCell key={name} className={styles.indexer}>
              {indexer}
            </TableRowCell>
          );
        }

        if (name === 'actions') {
          return (
            <TableRowCell key={name} className={styles.actions}>
              <IconButton name={icons.INFO} onPress={handleDetailsPress} />

              <IconButton
                title={translate('RemoveFromBlocklist')}
                name={icons.REMOVE}
                kind={kinds.DANGER}
                onPress={handleRemovePress}
              />
            </TableRowCell>
          );
        }

        return null;
      })}

      <BlocklistDetailsModal
        isOpen={isDetailsModalOpen}
        sourceTitle={sourceTitle}
        protocol={protocol}
        indexer={indexer}
        message={message}
        onModalClose={handleDetailsModalClose}
      />
    </TableRow>
  );
}

export default BlocklistRow;
