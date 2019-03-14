/**
 * This class implements using the following steganography algorithm.
 *
 * input:
 *
 * * Image Data (array)
 * * Separator (byte string)
 *
 * Output:
 *
 * * Message (binary string)
 *
 * ```python
 * function decode(image_data, separator):
 *    var message_length = get_message_length(image_data, separator)
 *    var message = []
 *    var pixel_index = get_start_index(message_length, separator)
 *    for i in 1...message_length:
 *        message += get_next_byte(image_data, pixel_index)
 *    return message
 *
 * function get_message_length(image_data, separator):
 *    current_message_length = []
 *    completed = false
 *
 *    while !completed:
 *       next_byte = get_next_byte(image_data)
 *       if not next_byte:
 *           throw_error("Invalid Image Data")
 *
 *       elif next_byte == separator && \
 *          current_message_length[-1] != separator  && \
 *          len(current_message_length) != 1:
 *          completed = true
 *       current_message_length + = next_byte
 *
 *    return to_decimal("".join(current_message_length))
 * ```
 *
 */
export default class DecodeLSB {
  private static readonly LARGEST_BYTE_VALUE = "11111111";
  /** The largest possible value for a byte (255) */
  private pixelIndex = 0;
  /** The index to start decoding the next byte from. */

  /**
   * Acts a main function decodes binary message from image data. **Note**: alpha channel is
   * ignored, so only Red Green Blue (RGB) channels are actually decoded from. The encoded data
   * contains the message length which is how many characters were encoded. This is then followed
   * by the actual encoded data, we need to look at 8 bytes (RGBRGBRG) and get their LSB to get
   * one.
   *
   * @param imageData: An array where numbers range from 0 - 255 (1 byte). In the order of Red \
   * Green Blue Alpha (repeating), like output from `canvas.getImageData()`.
   *
   * @return The decoded binary message as a string.
   */
  public decode = (imageData: number[]) => {
    this.pixelIndex = 0;
    const messageLength = this.getMessageLength(imageData);
    const binaryMessage: string[] = [];

    for (let i = 0; i < messageLength; i += 1) {
      const asciiByte = this.getNextLSBByte(imageData);
      this.pixelIndex += 10;

      binaryMessage.push(asciiByte);
    }
    return binaryMessage;
  };

  /**
   * Gets the message length at the front of the image data (top left data). It will end after the
   * first 8 bytes that aren't 255. We check each byte until we get a byte that's not 255. Since
   * 255 is the largest byte value we can have. It means there could be more binary "digits" to decode for message length.
   *
   * @param imageData: An array where numbers range from 0 - 255 (1 byte). In the order of Red \
   * Green Blue Alpha (repeating), like output from `canvas.getImageData()`.
   *
   * @return The message length in decimal.
   */
  private getMessageLength = (imageData: number[]) => {
    let completed = false;
    const binaryMessage: string[] = [];

    while (!completed) {
      const byte = this.getNextLSBByte(imageData);
      if (binaryMessage.slice(-1)[0] !== DecodeLSB.LARGEST_BYTE_VALUE) {
        completed = true;
      } else {
        binaryMessage.push(byte);
        this.pixelIndex += 10;
      }
    }

    const messageLengthBinary = binaryMessage.join("");
    const messageLength = parseInt(messageLengthBinary, 2);
    return messageLength;
  };

  /**
   * Gets the next byte of encoded data, since everything is encoded as ASCII strings. This will
   * be one character. So for example `u` would be `117` in decimal and the returned byte would
   * be `01110101` (pad front with 0s until we have a byte).
   *
   * @param imageData: An array where numbers range from 0 - 255 (1 byte). In the order of Red \
   * Green Blue Alpha (repeating), like output from `canvas.getImageData()`.
   *
   * @return The decoded byte.
   */
  private getNextLSBByte = (imageData: number[]) => {
    const currentPixel = imageData[this.pixelIndex];

    let byte = "";
    for (let j = 0; j < 8; j += 1) {
      let lsb = "0";
      if (currentPixel % 2 === 1) {
        lsb = "1";
      }
      byte += lsb;

      this.pixelIndex += 1;
      if (this.pixelIndex % 4 === 0) {
        this.pixelIndex += 1;
      }
    }

    return byte;
  };
}
