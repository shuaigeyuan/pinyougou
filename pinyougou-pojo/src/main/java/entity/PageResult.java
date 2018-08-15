package entity;

import com.pinyougou.pojo.TbBrand;

import java.io.Serializable;
import java.util.List;

public class PageResult  implements Serializable{
    private Long total;//总记录数
    private List rows;//当前页的结果集合

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public List getRows() {
        return rows;
    }

    public void setRows(List rows) {
        this.rows = rows;
    }
}
