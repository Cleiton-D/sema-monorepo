import * as React from "react"

export interface ImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
    blurDataURL?: string
  }

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ alt, onLoad, blurDataURL, src, style, ...props }, ref) => {
    const [loaded, setLoaded] = React.useState(false);

    const onLoadEvent = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setLoaded(true)
      onLoad?.(event)
    }

    return (
      <>
        <img
          style={loaded === true ? {...style, display: 'none'} : style}
          src={blurDataURL}
          alt={alt}
          ref={ref}
          {...props}
        />

        <img
          
          style={loaded === false ? {...style, display: 'none'} : style}
          src={src}
          alt={alt}
          onLoad={onLoadEvent}
          ref={ref}
          {...props}
        />
      </>
    )
  }
)
Image.displayName = "Image"

export { Image }
