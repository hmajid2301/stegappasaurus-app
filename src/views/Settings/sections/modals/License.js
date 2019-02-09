import React from 'react';

import MarkdownModal from '~/views/Settings/MarkdownModal';


const License = () => (
  <MarkdownModal name='License'>
    # License {'\n\n'}

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License [http://www.apache.org/licenses/LICENSE-2.0](here) {'\n\n'}

  </MarkdownModal>
);

export default License;
