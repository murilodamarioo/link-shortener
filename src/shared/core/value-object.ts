export abstract class ValueObject<Props> {
  protected readonly props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public equals(other: ValueObject<Props>): boolean {
    return JSON.stringify(this.props) === JSON.stringify(other.props)
  }
}